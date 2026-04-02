import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Package, DollarSign, MapPin, Eye } from 'lucide-react';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  let userInfo = null;
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo'));
  } catch {
    console.error('Invalid userInfo in localStorage');
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
        setError('Could not load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Shipped':
        return 'text-blue-600 bg-blue-100';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
          <button
            onClick={() => navigate('/shop')}
            className="bg-amber-700 text-white px-6 py-2 rounded-full hover:bg-amber-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-4 bg-amber-700 text-white px-6 py-2 rounded-full hover:bg-amber-800 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const totalAmount = order.orderItems.reduce((sum, item) => {
                const price = item.price?.$numberDecimal ? parseFloat(item.price.$numberDecimal) : item.price;
                return sum + (price * item.quantity);
              }, 0);

              return (
                <div key={order._id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        <Calendar size={16} className="inline mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">${totalAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">Order #{order._id.slice(-6).toUpperCase()}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <MapPin size={20} className="text-gray-400" />
                      <div>
                        <div className="font-semibold">Shipping Address</div>
                        <div className="text-sm text-gray-600">{order.shippingAddress.address}</div>
                        <div className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
                        <div className="text-sm text-gray-600">{order.shippingAddress.country}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DollarSign size={20} className="text-gray-400" />
                      <div>
                        <div className="font-semibold">Payment Method</div>
                        <div className="text-sm text-gray-600">{order.paymentMethod}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Package size={20} className="text-gray-400" />
                      <div>
                        <div className="font-semibold">Items</div>
                        <div className="text-sm text-gray-600">{order.orderItems.length} item(s)</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Order Items</h3>
                        <div className="space-y-2">
                          {order.orderItems.map((item) => (
                            <div key={item._id} className="flex items-center space-x-3">
                              <img
                                src={item.imageUrls?.[0] || 'https://placehold.co/60x60?text=No+Image'}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  ${item.price?.$numberDecimal 
                                    ? (parseFloat(item.price.$numberDecimal) * item.quantity).toFixed(2)
                                    : (item.price * item.quantity).toFixed(2)
                                  }
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Order Summary</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Items:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>$0.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>$0.00</span>
                          </div>
                          <div className="flex justify-between border-t pt-1 font-semibold">
                            <span>Total:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;