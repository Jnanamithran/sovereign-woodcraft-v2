import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  // Get all the necessary data and functions from our context
  const { cartItems, removeItem, updateQuantity, cartTotal, clearCart } = useCart();

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8">Your Shopping Cart</h1>

        {/* Conditional rendering: Show message if cart is empty */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <ShoppingCart size={64} className="mx-auto text-gray-300" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              to="/shop" 
              className="mt-6 inline-block bg-amber-700 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-amber-800 transition duration-300"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          // Show cart items and summary if cart is not empty
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Side: Cart Items List */}
            <div className="lg:w-2/3">
              <div className="bg-white shadow-md rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map(item => {
                    // Correctly handle different data structures for images and price
                    const imageSrc = item.images?.[0] || item.image || 'https://placehold.co/400x400?text=No+Image';
                    const priceValue = item.price?.$numberDecimal || item.price;

                    return (
                      // FIX: Use item._id for the unique key
                      <li key={item._id} className="flex items-center p-4 sm:p-6">
                        <img 
                          src={imageSrc} 
                          alt={item.name} 
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border" 
                        />
                        <div className="ml-4 sm:ml-6 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                            {/* FIX: Correctly format the price from the object or number */}
                            <p className="text-gray-600 mt-1">${Number(priceValue).toFixed(2)}</p>
                          </div>
                          {/* Quantity Controls */}
                          <div className="flex items-center mt-3">
                            {/* FIX: Use item._id in function calls */}
                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1.5 border rounded-md hover:bg-gray-100 transition-colors">
                              <Minus size={16} />
                            </button>
                            <span className="px-4 font-semibold w-12 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1.5 border rounded-md hover:bg-gray-100 transition-colors">
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        {/* FIX: Use item._id in function calls */}
                        <button onClick={() => removeItem(item._id)} className="ml-4 text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
                          <Trash2 size={20} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <Link to="/shop" className="flex items-center gap-2 text-amber-700 font-semibold hover:underline">
                  <ArrowLeft size={18} />
                  Continue Shopping
                </Link>
                <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-600 hover:underline">
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-4 mt-4 flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-amber-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-amber-800 transition duration-300 transform hover:scale-105">
                  Proceed to Checkout
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;