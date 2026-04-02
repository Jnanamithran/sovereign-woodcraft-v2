import asyncHandler from '../middleware/asyncHandler.js';
import Review from '../models/ReviewModel.js';
import Product from '../models/ProductModel.js';
import Order from '../models/OrderModel.js';
import mongoose from 'mongoose';

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 5, sort = 'newest' } = req.query;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Build sort options
  let sortOptions = {};
  switch (sort) {
    case 'newest':
      sortOptions = { createdAt: -1 };
      break;
    case 'oldest':
      sortOptions = { createdAt: 1 };
      break;
    case 'highest':
      sortOptions = { rating: -1, createdAt: -1 };
      break;
    case 'lowest':
      sortOptions = { rating: 1, createdAt: -1 };
      break;
    case 'helpful':
      sortOptions = { helpful: -1, createdAt: -1 };
      break;
    default:
      sortOptions = { createdAt: -1 };
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const limitNum = parseInt(limit);

  // Get reviews with pagination
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  // Get total count for pagination
  const totalReviews = await Review.countDocuments({ product: productId });
  const totalPages = Math.ceil(totalReviews / limitNum);

  // Calculate average rating
  const ratings = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);

  const avgRating = ratings.length > 0 ? ratings[0].avgRating : 0;
  const totalReviewCount = ratings.length > 0 ? ratings[0].totalReviews : 0;

  res.json({
    reviews,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalReviews: totalReviewCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    stats: {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: totalReviewCount,
    },
  });
});

// @desc    Create review for a product
// @route   POST /api/products/:productId/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment, title } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  // Check if user purchased this product (for verified reviews)
  const userOrder = await Order.findOne({
    user: req.user._id,
    'orderItems.product': productId,
    isPaid: true,
  });

  const review = new Review({
    user: req.user._id,
    product: productId,
    rating,
    comment,
    title,
    verified: !!userOrder, // Mark as verified if user purchased the product
  });

  await review.save();

  // Update product's review stats
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await product.save();

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    review,
  });
});

// @desc    Get review by ID
// @route   GET /api/products/:productId/reviews/:id
// @access  Public
export const getReviewById = asyncHandler(async (req, res) => {
  const { productId, id } = req.params;

  const review = await Review.findById(id).populate('user', 'name');
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.product.toString() !== productId) {
    res.status(404);
    throw new Error('Review not found for this product');
  }

  res.json(review);
});

// @desc    Update review
// @route   PUT /api/products/:productId/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const { productId, id } = req.params;
  const { rating, comment, title } = req.body;

  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }

  if (review.product.toString() !== productId) {
    res.status(404);
    throw new Error('Review not found for this product');
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  review.title = title || review.title;

  const updatedReview = await review.save();

  // Update product's review stats
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await product.save();

  res.json({
    success: true,
    message: 'Review updated successfully',
    review: updatedReview,
  });
});

// @desc    Delete review
// @route   DELETE /api/products/:productId/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const { productId, id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }

  if (review.product.toString() !== productId) {
    res.status(404);
    throw new Error('Review not found for this product');
  }

  await Review.deleteOne({ _id: id });

  // Update product's review stats
  const reviews = await Review.find({ product: productId });
  product.numReviews = reviews.length;
  product.rating = reviews.length > 0 
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
    : 0;
  await product.save();

  res.json({ message: 'Review removed' });
});

// @desc    Mark review as helpful
// @route   POST /api/products/:productId/reviews/:id/helpful
// @access  Private
export const markHelpful = asyncHandler(async (req, res) => {
  const { productId, id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.product.toString() !== productId) {
    res.status(404);
    throw new Error('Review not found for this product');
  }

  // Check if user already marked this review as helpful or not helpful
  const userReviewInteraction = await Review.findOne({
    _id: id,
    'helpfulBy': req.user._id
  });

  if (userReviewInteraction) {
    res.status(400);
    throw new Error('You have already marked this review');
  }

  review.helpful += 1;
  review.helpfulBy.push(req.user._id);
  await review.save();

  res.json({
    success: true,
    message: 'Review marked as helpful',
    helpful: review.helpful,
  });
});

// @desc    Mark review as not helpful
// @route   POST /api/products/:productId/reviews/:id/not-helpful
// @access  Private
export const markNotHelpful = asyncHandler(async (req, res) => {
  const { productId, id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.product.toString() !== productId) {
    res.status(404);
    throw new Error('Review not found for this product');
  }

  // Check if user already marked this review as helpful or not helpful
  const userReviewInteraction = await Review.findOne({
    _id: id,
    'notHelpfulBy': req.user._id
  });

  if (userReviewInteraction) {
    res.status(400);
    throw new Error('You have already marked this review');
  }

  review.notHelpful += 1;
  review.notHelpfulBy.push(req.user._id);
  await review.save();

  res.json({
    success: true,
    message: 'Review marked as not helpful',
    notHelpful: review.notHelpful,
  });
});