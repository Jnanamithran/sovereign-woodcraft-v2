import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/myorders`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              {order._id} — {order.status} — {order.totalPrice}$
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
