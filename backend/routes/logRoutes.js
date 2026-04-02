import express from 'express';
import { 
    getLogs,
    createLog
} from '../controllers/logController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all logs
// @route   GET /api/logs
// @access  Private/Admin
router.route('/').get(protect, admin, getLogs);

// @desc    Create log entry
// @route   POST /api/logs
// @access  Private/Admin
router.route('/').post(protect, admin, createLog);

export default router;