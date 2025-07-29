import express from 'express';
const router = express.Router();

// Temporary route to confirm the file is loaded correctly
router.get('/', (req, res) => {
  res.send('Product routes are working');
});

export default router;
