import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddressPage = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/address`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAddress(data.address || '');
      setLoading(false);
    };
    fetchAddress();
  }, []);

  const saveAddress = async () => {
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/users/address`,
      { address },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    alert('Address saved');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Address</h1>
      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border p-2 w-full"
      />
      <button onClick={saveAddress} className="bg-blue-500 text-white p-2 mt-2">
        Save
      </button>
    </div>
  );
};

export default AddressPage;
