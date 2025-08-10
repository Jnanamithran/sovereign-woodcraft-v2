// /backend/routes/userRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  authUser,
  registerUser,
  getUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

// Public routes for anyone to access
router.post('/login', authUser);
router.post('/', registerUser);

// Private route - only for logged-in users
router.get('/profile', protect, getUserProfile);

export default router;