import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Shared layout (includes Header, Footer, and Outlet)
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

const App = () => {
  let userInfo = null;
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo'));
  } catch (err) {
    console.error('Invalid userInfo in localStorage');
  }

  return (
    <Routes>
      {/* Routes that include header/footer layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />

        {/* ✅ Moved catch-all inside layout */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Standalone routes (outside of layout) */}
      <Route
        path="/login"
        element={!userInfo ? <LoginPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!userInfo ? <RegisterPage /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default App;
