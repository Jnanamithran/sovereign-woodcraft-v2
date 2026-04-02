import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* The <Outlet> component will render the matched child route element */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;