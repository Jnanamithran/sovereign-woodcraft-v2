import express from 'express';
import { getLogs } from '../controllers/logController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter: max 100 requests per 15 minutes per IP
const logsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.route('/').get(protect, admin, logsLimiter, getLogs);
router.get('/')

export default router;
