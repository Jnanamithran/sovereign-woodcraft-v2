import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Layout and Route Components
import AdminLayout from './components/AdminLayout.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Import Page Components
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import OrderListPage from './pages/OrderListPage.jsx';
// ✅ Import the new pages
import ProductManagementPage from './pages/ProductManagementPage.jsx';
import ActivityLogPage from './pages/ActivityLogPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route path="/" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="orders" element={<OrderListPage />} />
            {/* ✅ Add routes for the new pages */}
            <Route path="product-management" element={<ProductManagementPage />} />
            <Route path="activity-log" element={<ActivityLogPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
