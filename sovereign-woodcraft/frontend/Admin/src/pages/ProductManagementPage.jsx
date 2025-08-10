import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Check, X, Loader, AlertCircle, Trash2, Power } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editStockId, setEditStockId] = useState(null);
    const [newStock, setNewStock] = useState(0);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE_URL}/api/products/manage`, { withCredentials: true });
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleStockEdit = (product) => {
        setEditStockId(product._id);
        setNewStock(product.countInStock);
    };

    const handleStockUpdate = async (productId) => {
        try {
            const { data } = await axios.put(
                `${API_BASE_URL}/api/products/${productId}`,
                { countInStock: newStock },
                { withCredentials: true }
            );
            setProducts(products.map(p => (p._id === productId ? { ...p, countInStock: data.countInStock } : p)));
            setEditStockId(null);
        } catch (err) {
            setError('Failed to update stock.');
        }
    };

    const handleStatusToggle = async (productId, currentStatus) => {
        try {
            const { data } = await axios.put(
                `${API_BASE_URL}/api/products/${productId}`,
                { isActive: !currentStatus },
                { withCredentials: true }
            );
            setProducts(products.map(p => (p._id === productId ? { ...p, isActive: data.isActive } : p)));
        } catch (err) {
            setError('Failed to update product status.');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to permanently delete this product?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/products/${productId}`, { withCredentials: true });
                setProducts(products.filter(p => p._id !== productId));
            } catch (err) {
                setError('Failed to delete product.');
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader className="animate-spin h-8 w-8 text-amber-600" /></div>;
    }

    if (error) {
        return (
            <div className="flex items-center bg-red-100 text-red-700 p-4 rounded-lg">
                <AlertCircle className="h-5 w-5 mr-3" />
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Product Management</h1>
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id} className={!product.isActive ? 'bg-gray-100' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrls?.[0] || 'https://placehold.co/40x40/FBBF24/FFFFFF?text=P'} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className={`text-sm font-medium ${!product.isActive ? 'text-gray-500' : 'text-gray-900'}`}>{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editStockId === product._id ? (
                                        <input
                                            type="number"
                                            value={newStock}
                                            onChange={(e) => setNewStock(e.target.value)}
                                            className="w-20 border-gray-300 rounded-md shadow-sm"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-900">{product.countInStock}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.totalOrders || 0} {/* Placeholder */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-4">
                                        {editStockId === product._id ? (
                                            <>
                                                <button onClick={() => handleStockUpdate(product._id)} className="text-green-600 hover:text-green-900"><Check size={20} /></button>
                                                <button onClick={() => setEditStockId(null)} className="text-gray-600 hover:text-gray-900"><X size={20} /></button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleStockEdit(product)} className="text-amber-600 hover:text-amber-900"><Edit size={20} /></button>
                                        )}
                                        <button onClick={() => handleStatusToggle(product._id, product.isActive)} className={`hover:text-gray-900 ${product.isActive ? 'text-gray-400' : 'text-green-600'}`}>
                                            <Power size={20} />
                                        </button>
                                        <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductManagementPage;
