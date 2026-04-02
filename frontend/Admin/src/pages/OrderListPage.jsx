import React from 'react';

const OrderListPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
        <p className="text-gray-600 mt-2">This is where you will see a list of all customer orders.</p>
        
        {/* Placeholder for order table */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Order data will be displayed here.</p>
        </div>
    </div>
);

export default OrderListPage;
