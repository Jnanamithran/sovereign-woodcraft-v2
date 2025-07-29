import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

// A reusable Star Rating component
const StarRating = ({ rating, reviewCount }) => (
  <div className="flex items-center space-x-2">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
        />
      ))}
    </div>
    {reviewCount > 0 && (
      <span className="text-sm text-gray-500">{reviewCount} reviews</span>
    )}
  </div>
);

const ProductDetailPage = () => {
  const { id: productId } = useParams();
  const { addItem } = useCart();
  
  // State for product data, loading status, and errors
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for product options
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  // State for review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // State for review submission feedback
  const [loadingReview, setLoadingReview] = useState(false);
  const [errorReview, setErrorReview] = useState('');
  const [successReview, setSuccessReview] = useState(false);
  
  // Get user info from localStorage to check if they are logged in
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
        // Set default selections
        if (data.images && data.images.length > 0) setSelectedImage(data.images[0]);
        if (data.options?.colors?.length > 0) setSelectedColor(data.options.colors[0]);
        if (data.options?.sizes?.length > 0) setSelectedSize(data.options.sizes[0]);
        setLoading(false);
        setSuccessReview(false); // Reset review success state
      } catch (err) {
        // --- FIX: Display a more specific error message ---
        // This will show the error sent from your backend if available,
        // otherwise it will show a generic message.
        setError(err.response?.data?.message || 'Failed to load product. It may not exist.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, successReview]); // Re-fetch product data after a successful review submission

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      ...product,
      selectedColor,
      selectedSize,
      quantity: 1,
    });
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setLoadingReview(true);
    setErrorReview('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(`/api/products/${productId}/reviews`, { rating, comment }, config);
      
      setSuccessReview(true);
      setRating(0);
      setComment('');
    } catch (err) {
      setErrorReview(err.response?.data?.message || 'An error occurred while submitting your review.');
    } finally {
      setLoadingReview(false);
    }
  };

  // --- Conditional Rendering ---
  // These checks prevent errors if the data isn't ready yet.
  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-20">{error}</div>;
  if (!product) return null; // Don't render anything if there's no product

  return (
    <div className="bg-gray-50 font-sans">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {/* Images Section */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pr-2">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === img ? 'border-amber-500' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(img)}
                  onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=No+Image'; }}
                />
              ))}
            </div>
            <div className="flex-1">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
                onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=Image+Not+Found'; }}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-md text-gray-500 mt-1">By {product.brand}</p>
            <div className="my-4">
              <StarRating rating={product.rating} reviewCount={product.numReviews} />
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mb-4">${Number(product.price?.$numberDecimal || product.price).toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Options Section */}
            <div className="space-y-4 mb-6">
              {product.options?.colors?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Color: <span className="font-bold">{selectedColor}</span></h3>
                  <div className="flex items-center space-x-2">
                    {product.options.colors.map((color) => (
                      <button key={color} onClick={() => setSelectedColor(color)} className={`h-8 w-8 rounded-full border-2 ${selectedColor === color ? 'border-amber-500 ring-2 ring-amber-300' : 'border-gray-200'}`} style={{ backgroundColor: color.toLowerCase().replace(' ', '') }} />
                    ))}
                  </div>
                </div>
              )}
              {product.options?.sizes?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Size: <span className="font-bold">{selectedSize}</span></h3>
                  <div className="flex flex-wrap gap-2">
                    {product.options.sizes.map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedSize === size ? 'bg-amber-700 text-white border-amber-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-700 text-white font-semibold rounded-lg shadow-md hover:bg-amber-800 transition-all duration-300 transform hover:scale-105">
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                <Zap className="h-5 w-5" /> Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews & Review Form Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
          {/* Existing Reviews */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Reviews</h2>
            {product.reviews.length === 0 ? (
              <div className="p-4 bg-gray-100 rounded-md text-gray-600">No reviews yet. Be the first!</div>
            ) : (
              <ul className="space-y-6">
                {product.reviews.map(review => (
                  <li key={review._id} className="border-b pb-4">
                    <strong className="font-semibold">{review.name}</strong>
                    <StarRating rating={review.rating} />
                    <p className="text-gray-500 text-sm mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Add Review Form */}
          <div className="mt-10 lg:mt-0">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Write a Review</h3>
            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="bg-white p-6 rounded-lg shadow-md">
                {successReview && <p className="p-3 bg-green-100 text-green-800 rounded-md mb-4">Review submitted successfully!</p>}
                {errorReview && <p className="p-3 bg-red-100 text-red-800 rounded-md mb-4">{errorReview}</p>}
                
                <div className="mb-4">
                  <label htmlFor="rating" className="block font-medium mb-1">Rating</label>
                  <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block font-medium mb-1">Comment</label>
                  <textarea id="comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
                </div>
                <button type="submit" disabled={loadingReview} className="w-full bg-amber-700 text-white py-2 px-6 rounded-lg hover:bg-amber-800 disabled:bg-gray-400 transition-colors">
                  {loadingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-blue-50 rounded-md text-gray-700">
                Please <Link to="/login" className="text-amber-600 font-bold hover:underline">log in</Link> to write a review.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
