import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductReviews = ({ productId, initialReviews = [], initialStats = {} }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState(initialReviews);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortOption, currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/products/${productId}/reviews`, {
        params: {
          page: currentPage,
          limit: 5,
          sort: sortOption,
        },
      });
      
      if (currentPage === 1) {
        setReviews(data.reviews);
      } else {
        setReviews(prev => [...prev, ...data.reviews]);
      }
      
      setStats(data.stats);
      setHasMore(data.pagination.hasNextPage);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const getStarRating = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">{stats.averageRating || 0}</span>
              <span className="text-gray-600">out of 5</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{getStarRating(stats.averageRating || 0)}</span>
              <span>{stats.totalReviews || 0} reviews</span>
            </div>
          </div>
          
          {userInfo && (
            <WriteReviewButton productId={productId} onReviewAdded={fetchReviews} />
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Customer Reviews</h3>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        )}

        {hasMore && (
          <div className="text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-brown-600 text-white px-6 py-2 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More Reviews'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [notHelpfulCount, setNotHelpfulCount] = useState(review.notHelpful);

  const handleHelpful = async () => {
    try {
      await axios.post(`/api/products/${review.product}/reviews/${review._id}/helpful`);
      setHelpfulCount(prev => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as helpful');
    }
  };

  const handleNotHelpful = async () => {
    try {
      await axios.post(`/api/products/${review.product}/reviews/${review._id}/not-helpful`);
      setNotHelpfulCount(prev => prev + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as not helpful');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg font-semibold">{review.title}</span>
            <span className="text-sm text-gray-500">by {review.user.name}</span>
            {review.verified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified Purchase
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">{getStarRating(review.rating)}</span>
              <span className="text-sm text-gray-600">({review.rating}/5)</span>
            </div>
            <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
          </div>
          
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>
        
        <div className="ml-4 flex flex-col space-y-2">
          <button
            onClick={handleHelpful}
            className="text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            Helpful ({helpfulCount})
          </button>
          <button
            onClick={handleNotHelpful}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            Not Helpful ({notHelpfulCount})
          </button>
        </div>
      </div>
    </div>
  );
};

const WriteReviewButton = ({ productId, onReviewAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.comment) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`/api/products/${productId}/reviews`, formData);
      toast.success(data.message);
      setShowForm(false);
      setFormData({ rating: 5, title: '', comment: '' });
      onReviewAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} stars
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
              placeholder="Summarize your experience"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
              placeholder="Share your thoughts about this product"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brown-600 text-white py-2 px-4 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="bg-brown-600 text-white px-6 py-2 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500"
    >
      Write a Review
    </button>
  );
};

const getStarRating = (rating) => {
  return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default ProductReviews;