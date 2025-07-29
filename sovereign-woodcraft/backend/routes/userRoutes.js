import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/userController.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(getUserProfile));

export default router;
