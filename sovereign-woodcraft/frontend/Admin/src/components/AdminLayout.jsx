import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, PackagePlus, ShoppingCart, LogOut, Menu, X } from 'lucide-react';

/**
 * AdminLayout Component
 * This is the main frame for the admin panel, including a sidebar and content area.
 */
const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    };

    // Reusable sidebar content
    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-gray-400 text-sm">Sovereign Woodcraft</p>
            </div>
            <nav className="flex-grow px-4">
                <Link to="/" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                    <LayoutDashboard className="mr-3" /> Dashboard
                </Link>
                <Link to="/add-product" className="flex items-center mt-2 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                    <PackagePlus className="mr-3" /> Add Product
                </Link>
                <Link to="/orders" className="flex items-center mt-2 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                    <ShoppingCart className="mr-3" /> Orders
                </Link>
            </nav>
            <div className="p-4">
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                    <LogOut className="mr-3" /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-shrink-0 bg-gray-800">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-30 bg-gray-800 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                 <SidebarContent />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-4 bg-white border-b md:hidden">
                    <h1 className="text-xl font-bold">Admin</h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X/> : <Menu />}
                    </button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet /> {/* Child routes will be rendered here */}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
