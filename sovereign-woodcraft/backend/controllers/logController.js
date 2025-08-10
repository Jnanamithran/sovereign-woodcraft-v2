import asyncHandler from '../middleware/asyncHandler.js';
import Log from '../models/LogModel.js';

// @desc    Fetch all activity logs
// @route   GET /api/logs
// @access  Private/Admin
const getLogs = asyncHandler(async (req, res) => {
  // Fetch logs and sort them by the newest first
  const logs = await Log.find({}).sort({ createdAt: -1 });
  res.status(200).json(logs);
});

export { getLogs };
