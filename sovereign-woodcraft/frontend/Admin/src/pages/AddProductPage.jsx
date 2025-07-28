import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, Loader, XCircle } from 'lucide-react';

// In a real app, these would come from an environment variable (e.g., process.env.REACT_APP_API_URL)
const API_BASE_URL = 'http://localhost:5001'; // Example base URL
const API_UPLOAD_URL = `${API_BASE_URL}/api/upload/multiple`;
const API_PRODUCTS_URL = `${API_BASE_URL}/api/products`;

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Chairs');
    const [images, setImages] = useState([]); // State for an array of file objects
    const [imagePreviews, setImagePreviews] = useState([]); // State for an array of image preview URLs
    const [countInStock, setCountInStock] = useState(0);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    /**
     * Handles the file input change event for multiple files.
     * Appends new files and their preview URLs to the existing state arrays.
     */
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [...images, ...files];
            const newImagePreviews = [...imagePreviews, ...files.map(file => URL.createObjectURL(file))];
            
            setImages(newImages);
            setImagePreviews(newImagePreviews);
        }
    };

    /**
     * Removes a selected image and its preview before upload.
     * @param {number} index - The index of the image to remove.
     */
    const handleRemoveImage = (index) => {
        const newImages = [...images];
        const newImagePreviews = [...imagePreviews];
        
        // Revoke the object URL to free up memory before removing it
        URL.revokeObjectURL(imagePreviews[index]);

        newImages.splice(index, 1);
        newImagePreviews.splice(index, 1);

        setImages(newImages);
        setImagePreviews(newImagePreviews);
    };

    /**
     * Handles the form submission.
     * It first uploads all images, then creates the product with the returned image URLs.
     */
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (images.length === 0) {
            setError('Please select at least one image to upload.');
            setLoading(false);
            return;
        }

        // 1. Upload all image files
        const formData = new FormData();
        images.forEach(imageFile => {
            formData.append('images', imageFile); // Backend must be able to handle an array of 'images'
        });

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.token) {
                throw new Error('You must be logged in to add a product.');
            }
            const { token } = userInfo;

            const uploadConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data: uploadData } = await axios.post(API_UPLOAD_URL, formData, uploadConfig);
            const imageUrls = uploadData.imageUrls; // Server should return an array of URLs

            // 2. Create the new product with the returned image URLs
            const productConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const productData = { name, price, description, category, imageUrls, countInStock };
            await axios.post(API_PRODUCTS_URL, productData, productConfig);
            
            setSuccess('Product added successfully! Clearing form...');
            
            // Clear form fields after a short delay to allow user to see success message
            setTimeout(() => {
                setName('');
                setPrice('');
                setDescription('');
                setCategory('Chairs');
                setImages([]);
                setImagePreviews([]);
                setCountInStock(0);
                if(document.getElementById('image-upload')) {
                    document.getElementById('image-upload').value = null;
                }
                setSuccess('');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to add product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Product</h1>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    {error && (
                        <div className="flex items-center bg-red-100 text-red-700 p-4 mb-6 rounded-lg">
                            <AlertCircle className="h-5 w-5 mr-3" />
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center bg-green-100 text-green-700 p-4 mb-6 rounded-lg">
                            <CheckCircle className="h-5 w-5 mr-3" />
                            <span>{success}</span>
                        </div>
                    )}
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label><input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" /></div>
                            <div><label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">Count In Stock</label><input type="number" id="countInStock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" /></div>
                        </div>
                        <div><label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label><textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"></textarea></div>
                        <div><label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"><option>Chairs</option><option>Tables</option><option>Shelving</option><option>Desks</option><option>Accessories</option></select></div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Images</label>
                            {imagePreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={preview} className="relative group">
                                            <img src={preview} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-0.5 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <XCircle className="h-6 w-6" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-2 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                                            <span>Upload files</span>
                                            <input id="image-upload" name="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" multiple />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            {loading ? <><Loader className="animate-spin h-5 w-5 mr-3" />Processing...</> : 'Add Product'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;
