import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/verify-email');
    }
  }, [userInfo, navigate]);

  const handleVerifyEmail = async () => {
    if (!token) {
      toast.error('Invalid verification link');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post('/api/users/verify-email', { token }, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success(data.message);
      setVerified(true);
      
      // Update user info in Redux store
      dispatch({
        type: 'USER_LOGIN_SUCCESS',
        payload: { ...userInfo, isEmailVerified: true }
      });

    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post('/api/users/send-verification', {}, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  if (userInfo?.isEmailVerified) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Already Verified</h1>
          <p className="text-gray-600 mb-6">Your email address has already been verified.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-brown-600 text-white px-6 py-2 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M4 12h16" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">Please verify your email address to complete your account setup.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {verified ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">Email Verified Successfully!</h2>
              <p className="text-gray-600 mb-6">Your email address has been verified. You can now enjoy full access to your account.</p>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-brown-600 text-white py-2 px-4 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Click the verify button to confirm your email address</li>
                  <li>• Your account will be fully activated</li>
                  <li>• You'll be able to place orders and track shipments</li>
                </ul>
              </div>

              <button
                onClick={handleVerifyEmail}
                disabled={loading}
                className="w-full bg-brown-600 text-white py-3 px-4 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email Address'}
              </button>

              <div className="text-center">
                <p className="text-gray-600 text-sm">Didn't receive the email?</p>
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="text-brown-600 hover:text-brown-700 text-sm font-medium"
                >
                  Resend Verification Email
                </button>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 text-center">
                  If you continue to have issues, please contact support@sovereignwoodcraft.com
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;