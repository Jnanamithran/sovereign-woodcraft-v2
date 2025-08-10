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

// New pages
import ProfilePage from './pages/ProfilePage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import AddressPage from './pages/AddressPage.jsx';

const App = () => {
  let userInfo = null;
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo'));
  } catch {
    console.error('Invalid userInfo in localStorage');
  }

  return (
    <Routes>
      {/* Routes with header/footer layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />

        {/* Protected routes */}
        <Route
          path="profile"
          element={userInfo ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="orders"
          element={userInfo ? <OrdersPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="address"
          element={userInfo ? <AddressPage /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Standalone routes */}
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
