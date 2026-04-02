import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import { CartProvider } from './context/CartContext.jsx';
import App from './App.jsx';
import './index.css';

// --- Set the default base URL for all API requests ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
axios.defaults.baseURL = API_BASE_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);