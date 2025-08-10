import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PackagePlus, ShoppingCart, Loader, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const ActivityLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                // NOTE: You will need to create this backend endpoint
                const { data } = await axios.get(`${API_BASE_URL}/api/logs`, { withCredentials: true });
                setLogs(data);
            } catch (err) {
                setError('Failed to fetch activity logs.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'PRODUCT_ADDED':
                return <PackagePlus className="h-6 w-6 text-white" />;
            case 'ORDER_PLACED':
                return <ShoppingCart className="h-6 w-6 text-white" />;
            default:
                return null;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Activity Log</h1>
            <div className="space-y-8">
                {logs.map(log => (
                    <div key={log._id} className="flex items-start">
                        <div className="flex-shrink-0">
                            <span className={`flex items-center justify-center h-12 w-12 rounded-full ${log.type === 'PRODUCT_ADDED' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                {getIcon(log.type)}
                            </span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{log.description}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(log.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityLogPage;
