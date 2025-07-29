import express from 'express';
const router = express.Router();

// Temporary route to confirm the file is loaded correctly
router.post('/login', (req, res) => {
  res.send('Auth routes are working');
});

export default router;
