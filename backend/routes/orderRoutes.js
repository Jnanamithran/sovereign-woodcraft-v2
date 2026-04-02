import express from 'express';
import { 
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    deleteOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.route('/').post(protect, createOrder);

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.route('/myorders').get(protect, getMyOrders);

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.route('/:id').get(protect, getOrderById);

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.route('/:id/pay').put(protect, updateOrderToPaid);

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.route('/').get(protect, admin, getOrders);

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
router.route('/:id').delete(protect, admin, deleteOrder);

export default router;