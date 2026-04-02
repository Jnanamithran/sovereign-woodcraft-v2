import express from 'express';
import { 
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getReviewById,
    markHelpful,
    markNotHelpful
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
router.route('/').get(getReviews);

// @desc    Create review for a product
// @route   POST /api/products/:productId/reviews
// @access  Private
router.route('/').post(protect, createReview);

// @desc    Get review by ID
// @route   GET /api/products/:productId/reviews/:id
// @access  Public
router.route('/:id').get(getReviewById);

// @desc    Update review
// @route   PUT /api/products/:productId/reviews/:id
// @access  Private
router.route('/:id').put(protect, updateReview);

// @desc    Delete review
// @route   DELETE /api/products/:productId/reviews/:id
// @access  Private
router.route('/:id').delete(protect, deleteReview);

// @desc    Mark review as helpful
// @route   POST /api/products/:productId/reviews/:id/helpful
// @access  Private
router.route('/:id/helpful').post(protect, markHelpful);

// @desc    Mark review as not helpful
// @route   POST /api/products/:productId/reviews/:id/not-helpful
// @access  Private
router.route('/:id/not-helpful').post(protect, markNotHelpful);

export default router;