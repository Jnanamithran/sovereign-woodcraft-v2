import express from 'express';
import { 
    createPaymentIntent,
    getPaymentStatus,
    handleWebhook,
    refundPayment
} from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', protect, createPaymentIntent);

// @desc    Get payment status
// @route   GET /api/payments/:paymentIntentId/status
// @access  Private
router.get('/:paymentIntentId/status', protect, getPaymentStatus);

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public (Stripe webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// @desc    Refund payment
// @route   POST /api/payments/:paymentId/refund
// @access  Private/Admin
router.post('/:paymentId/refund', protect, admin, refundPayment);

export default router;