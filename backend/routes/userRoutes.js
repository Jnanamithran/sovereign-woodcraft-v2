import express from 'express';
import { 
    getUserProfile, 
    updateUserProfile,
    getUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// @desc    Manage user addresses
// @route   GET /api/users/addresses
// @access  Private
router.route('/addresses')
    .get(protect, getUserAddresses)
    .post(protect, addUserAddress);

// @desc    Manage specific user address
// @route   PUT/DELETE /api/users/addresses/:id
// @access  Private
router.route('/addresses/:id')
    .put(protect, updateUserAddress)
    .delete(protect, deleteUserAddress);

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
// @access  Private
router.put('/addresses/:id/default', protect, setDefaultAddress);

export default router;