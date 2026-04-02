import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Edit, Save, Plus, Trash2 } from 'lucide-react';

const AddressPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  let userInfo = null;
  try {
    userInfo = JSON.parse(localStorage.getItem('userInfo'));
  } catch {
    console.error('Invalid userInfo in localStorage');
  }

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/users/addresses', config);
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error('Failed to load addresses', err);
        setError('Could not load your addresses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchAddresses();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post('/api/users/addresses', newAddress, config);
      setAddresses([...addresses, data.address]);
      setNewAddress({
        address: '',
        city: '',
        postalCode: '',
        country: '',
        isDefault: false
      });
    } catch (err) {
      console.error('Failed to add address', err);
      setError('Could not add address. Please try again later.');
    }
  };

  const handleEditAddress = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/api/users/addresses/${editingAddress._id}`, editingAddress, config);
      setAddresses(addresses.map(addr => 
        addr._id === editingAddress._id ? editingAddress : addr
      ));
      setIsEditing(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Failed to update address', err);
      setError('Could not update address. Please try again later.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.delete(`/api/users/addresses/${addressId}`, config);
      setAddresses(addresses.filter(addr => addr._id !== addressId));
    } catch (err) {
      console.error('Failed to delete address', err);
      setError('Could not delete address. Please try again later.');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/api/users/addresses/${addressId}/default`, {}, config);
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      })));
    } catch (err) {
      console.error('Failed to set default address', err);
      setError('Could not set default address. Please try again later.');
    }
  };

  if (loading) return <div className="text-center py-8">Loading addresses...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Addresses</h1>
          <button
            onClick={() => navigate('/profile')}
            className="bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Back to Profile
          </button>
        </div>

        {addresses.length === 0 && !isEditing ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Addresses Saved</h2>
            <p className="text-gray-500 mb-6">You haven't saved any addresses yet.</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-amber-700 text-white px-6 py-2 rounded-full hover:bg-amber-800 transition-colors"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Existing Addresses */}
            {addresses.map((address) => (
              <div key={address._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <MapPin size={24} className="text-gray-400" />
                    <div>
                      <h3 className="font-semibold">{address.address}</h3>
                      <p className="text-sm text-gray-600">{address.city}, {address.postalCode} {address.country}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Default
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setIsEditing(true);
                      }}
                      className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Set as Default Address
                  </button>
                )}
              </div>
            ))}

            {/* Add/Edit Address Form */}
            {(isEditing || addresses.length === 0) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <form onSubmit={editingAddress ? handleEditAddress : handleAddAddress}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={editingAddress ? editingAddress.address : newAddress.address}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({...editingAddress, address: e.target.value})
                          : setNewAddress({...newAddress, address: e.target.value})
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={editingAddress ? editingAddress.city : newAddress.city}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({...editingAddress, city: e.target.value})
                          : setNewAddress({...newAddress, city: e.target.value})
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={editingAddress ? editingAddress.postalCode : newAddress.postalCode}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({...editingAddress, postalCode: e.target.value})
                          : setNewAddress({...newAddress, postalCode: e.target.value})
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={editingAddress ? editingAddress.country : newAddress.country}
                        onChange={(e) => editingAddress 
                          ? setEditingAddress({...editingAddress, country: e.target.value})
                          : setNewAddress({...newAddress, country: e.target.value})
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={editingAddress ? editingAddress.isDefault : newAddress.isDefault}
                      onChange={(e) => editingAddress 
                        ? setEditingAddress({...editingAddress, isDefault: e.target.checked})
                        : setNewAddress({...newAddress, isDefault: e.target.checked})
                      }
                      className="mr-2"
                    />
                    <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex items-center bg-amber-700 text-white px-6 py-2 rounded-full hover:bg-amber-800 transition-colors"
                    >
                      <Save size={16} className="mr-2" />
                      {editingAddress ? 'Update Address' : 'Add Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingAddress(null);
                      }}
                      className="flex items-center bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Add New Address Button */}
            {!isEditing && (
              <div className="text-center">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center bg-amber-700 text-white px-6 py-2 rounded-full hover:bg-amber-800 transition-colors mx-auto"
                >
                  <Plus size={16} className="mr-2" />
                  Add New Address
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;