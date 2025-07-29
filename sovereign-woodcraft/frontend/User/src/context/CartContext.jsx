import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context which will be shared across components
const CartContext = createContext();

// 2. Create and EXPORT the custom hook for easy access to the context.
// This is the 'useCart' function that Header.jsx is looking for.
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Create and EXPORT the Provider component that will hold the state and logic
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
      // Check for item._id because data comes from MongoDB
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // If item already exists, just update its quantity
        return prevItems.map(item =>
          item._id === product._id
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
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0) // Automatically remove item if quantity becomes 0
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // --- CALCULATED VALUES ---
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.price?.$numberDecimal ? parseFloat(item.price.$numberDecimal) : item.price;
    return total + price * item.quantity;
  }, 0);

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
