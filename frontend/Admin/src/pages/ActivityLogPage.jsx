import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, Package, DollarSign, Filter, RefreshCw } from 'lucide-react';

const ActivityLogPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  let userInfo = null;
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo'));
  } catch {
    console.error('Invalid userInfo in localStorage');
  }

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/logs', config);
        setActivities(data);
      } catch (err) {
        console.error('Failed to load activities', err);
        setError('Could not load activity log. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchActivities();
    } else {
      // Redirect to login would go here if this was a protected route
    }
  }, [userInfo]);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'All') return true;
    return activity.action === filter;
  });

  const getActivityIcon = (action) => {
    switch (action) {
      case 'Product Created':
      case 'Product Updated':
      case 'Product Deleted':
        return <Package size={20} className="text-blue-600" />;
      case 'Order Created':
      case 'Order Updated':
        return <DollarSign size={20} className="text-green-600" />;
      case 'User Registered':
      case 'User Login':
        return <User size={20} className="text-purple-600" />;
      default:
        return <Calendar size={20} className="text-gray-600" />;
    }
  };

  const getActivityColor = (action) => {
    switch (action) {
      case 'Product Created':
      case 'Product Updated':
        return 'bg-blue-100 text-blue-800';
      case 'Product Deleted':
        return 'bg-red-100 text-red-800';
      case 'Order Created':
      case 'Order Updated':
        return 'bg-green-100 text-green-800';
      case 'User Registered':
      case 'User Login':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-8">Loading activity log...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Activity Log</h1>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by action:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Actions</option>
              <option value="Product Created">Product Created</option>
              <option value="Product Updated">Product Updated</option>
              <option value="Product Deleted">Product Deleted</option>
              <option value="Order Created">Order Created</option>
              <option value="Order Updated">Order Updated</option>
              <option value="User Registered">User Registered</option>
              <option value="User Login">User Login</option>
            </select>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No activities found for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-2 rounded-full">
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.action)}`}>
                          {activity.action}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-800">{activity.description}</p>
                      {activity.details && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600">{activity.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">By: {activity.user || 'System'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;