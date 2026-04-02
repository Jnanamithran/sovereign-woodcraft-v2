import asyncHandler from '../middleware/asyncHandler.js';
import { getLogs as readLogs, writeLogs } from '../utils/jsonData.js';

// Helper function to find log by ID
const findLogById = (logs, id) => {
  return logs.find(l => l._id === id);
};

// @desc    Get all logs
// @route   GET /api/logs
// @access  Private/Admin
export const getLogs = asyncHandler(async (req, res) => {
  const logs = await readLogs();
  // Sort by timestamp descending (newest first)
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(sortedLogs);
});

// @desc    Create log entry
// @route   POST /api/logs
// @access  Private/Admin
export const createLog = asyncHandler(async (req, res) => {
  const { action, description, details, user } = req.body;

  const logs = await readLogs();
  
  // Generate new log ID
  const maxId = logs.reduce((max, l) => {
    const id = parseInt(l._id, 10);
    return id > max ? id : max;
  }, 0);

  const log = {
    _id: (maxId + 1).toString(),
    action,
    description,
    details,
    user: user || req.user.name,
    timestamp: new Date().toISOString()
  };

  logs.push(log);
  await writeLogs(logs);

  res.status(201).json(log);
});

// @desc    Get log by ID
// @route   GET /api/logs/:id
// @access  Private/Admin
export const getLogById = asyncHandler(async (req, res) => {
  const logs = await readLogs();
  const log = findLogById(logs, req.params.id);
  
  if (log) {
    res.json(log);
  } else {
    res.status(404);
    throw new Error('Log not found');
  }
});

// @desc    Delete log
// @route   DELETE /api/logs/:id
// @access  Private/Admin
export const deleteLog = asyncHandler(async (req, res) => {
  const logs = await readLogs();
  const logIndex = logs.findIndex(l => l._id === req.params.id);

  if (logIndex !== -1) {
    logs.splice(logIndex, 1);
    await writeLogs(logs);
    res.json({ message: 'Log entry removed' });
  } else {
    res.status(404);
    throw new Error('Log not found');
  }
});

// @desc    Clear all logs
// @route   DELETE /api/logs/clear
// @access  Private/Admin
export const clearLogs = asyncHandler(async (req, res) => {
  await writeLogs([]);
  res.json({ message: 'All logs cleared' });
});