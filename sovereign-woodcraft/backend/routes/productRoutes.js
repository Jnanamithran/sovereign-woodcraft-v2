// /routes/productRoutes.js
import express from 'express';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have this

const router = express.Router();

// --- ADD THIS NEW ROUTE FOR THE HOMEPAGE ---
// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
router.get('/top', async (req, res) => {
  try {
    // Get top 3 products sorted by rating in descending order
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching top products' });
  }
});

// GET /api/products – This route is for your ShopPage
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET /api/products/:id – This route is for your ProductDetailPage
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product details' });
  }
});

// POST /api/products/:id/reviews - For submitting reviews
router.post('/:id/reviews', protect, async (req, res) => {
    // ... your review submission logic from before
});


export default router;