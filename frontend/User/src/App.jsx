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
import ProfilePage from './pages/ProfilePage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import AddressPage from './pages/AddressPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx';
import PaymentFailurePage from './pages/PaymentFailurePage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';

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
        <Route path="search" element={<SearchResultsPage />} />

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
          path="addresses"
          element={userInfo ? <AddressPage /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Standalone routes (no header/footer) */}
      <Route
        path="/login"
        element={!userInfo ? <LoginPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!userInfo ? <RegisterPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/forgot-password"
        element={!userInfo ? <ForgotPasswordPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/reset-password"
        element={!userInfo ? <ResetPasswordPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/verify-email"
        element={<VerifyEmailPage />}
      />
      <Route
        path="/checkout"
        element={userInfo ? <CheckoutPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/payment-success/:orderId"
        element={userInfo ? <PaymentSuccessPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/payment-failure"
        element={userInfo ? <PaymentFailurePage /> : <Navigate to="/checkout" replace />}
      />
    </Routes>
  );
};

export default App;