import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailurePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h1>
          <p className="text-gray-600">We're sorry, but your payment could not be processed.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">What happened?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>The payment was declined by your bank or card issuer</li>
            <li>There may be insufficient funds in your account</li>
            <li>Your card details may be incorrect</li>
            <li>Your card may not be enabled for online payments</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">What can you do?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Check your payment details and try again</li>
            <li>Contact your bank to verify your card is active for online payments</li>
            <li>Try using a different payment method</li>
            <li>Wait a few minutes and try again</li>
          </ul>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Need Help?</h3>
            <p className="text-yellow-700 text-sm">
              If you continue to experience issues, please contact our customer support team
              at support@sovereignwoodcraft.com or call us at (555) 123-4567.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-brown-600 text-white px-6 py-3 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Review Cart
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

export default PaymentFailurePage;