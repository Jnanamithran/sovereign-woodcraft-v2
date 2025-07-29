// /routes/productRoutes.js

import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
} from '../controllers/productController.js';

const router = express.Router();

/**
 * @desc    Fetch all products
 * @route   GET /api/products
 */
router.get('/', getProducts);

/**
 * @desc    Fetch featured products (limit to 4)
 * @route   GET /api/products/featured
 */
router.get('/featured', getFeaturedProducts);

/**
 * @desc    Fetch single product by ID
 * @route   GET /api/products/:id
 */
router.get('/:id', getProductById);

export default router;
