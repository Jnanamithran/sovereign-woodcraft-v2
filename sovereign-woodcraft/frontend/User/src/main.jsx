import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios'; // Import axios here

import { CartProvider } from './context/CartContext.jsx';
import App from './App.jsx';
import './index.css';

// --- FIX: Set the default base URL for all API requests ---
// This tells axios to send all requests to your live backend on Render.
axios.defaults.baseURL = 'https://sovereign-woodcraft-v2.onrender.com';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
