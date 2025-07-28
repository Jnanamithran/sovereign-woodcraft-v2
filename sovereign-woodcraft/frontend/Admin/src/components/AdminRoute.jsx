import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const [isAllowed, setIsAllowed] = useState(null); // null = still checking

  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    try {
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      if (userInfo?.isAdmin) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    } catch (err) {
      console.error("Failed to parse userInfo:", err);
      localStorage.removeItem('userInfo');
      setIsAllowed(false);
    }
  }, []);

  // While checking, render nothing or a loading spinner
  if (isAllowed === null) {
    return <div className="p-10 text-center">Checking access...</div>;
  }

  // If not allowed, redirect
  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  // Else render child routes
  return <Outlet />;
};

export default AdminRoute;
