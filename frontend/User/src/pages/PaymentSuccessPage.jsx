import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setOrder(data);
      } catch (error) {
        toast.error('Failed to load order details');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    if (orderId && userInfo) {
      fetchOrder();
    }
  }, [orderId, userInfo, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-brown-600 text-white px-6 py-2 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500"
          >
            View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-sm text-gray-600">Order Number</span>
              <p className="font-medium">{order._id}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Order Date</span>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Payment Method</span>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Status</span>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Paid
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-gray-600">
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          
          {order.orderItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center space-x-4">
                <img 
                  src={item.imageUrls[0]} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">Qty: {item.qty}</p>
                </div>
              </div>
              <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 bg-brown-600 text-white px-6 py-3 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;