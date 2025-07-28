import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context which will be shared across components
const CartContext = createContext();

// 2. Create a custom hook for easy access to the context from any component
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Create the Provider component that will hold the state and logic
export const CartProvider = ({ children }) => {
  // Initialize state by trying to load from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('sovereign_cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart items from localStorage", error);
      return [];
    }
  });

  // Save to localStorage whenever cartItems state changes
  useEffect(() => {
    localStorage.setItem('sovereign_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // --- CART MANAGEMENT FUNCTIONS ---

  const addItem = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item already exists, just update its quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Otherwise, add the new product to the cart array
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0) // Automatically remove item if quantity becomes 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // --- CALCULATED VALUES ---

  // Calculate the total number of items in the cart
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Calculate the total price of all items in the cart
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // The value object that will be provided to all consuming components
  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
