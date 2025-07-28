import React from 'react';

const DashboardPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel. Select an option from the sidebar to get started.</p>
        
        {/* You could add summary stats here in the future */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-500">Total Sales</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">$12,450</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-500">New Orders</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">32</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-500">Total Products</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">8</p>
            </div>
        </div>
    </div>
);

export default DashboardPage;
