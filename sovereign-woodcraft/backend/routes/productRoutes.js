import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
    getProducts, 
    getProductById, 
    getFeaturedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsForManagement // Import the new controller function
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // For security

// Rate limiter for admin product modification (update/delete)
const adminProductLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // max 20 requests per window per IP for product updates
    message: 'Too many product update requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

// Routes for fetching products and creating a new one
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct); // Create a product (admin only)

// ✅ ADD THIS ROUTE: Must be before the '/:id' route
router.get('/manage', protect, admin, getProductsForManagement);

// Route for featured products
router.get('/featured', getFeaturedProducts); 

// Routes for a single product by its ID
router.route('/:id')
    .get(getProductById)
    .put(adminProductLimiter, protect, admin, updateProduct)    // Update a product (admin only, rate-limited)
    .delete(protect, admin, deleteProduct); // Delete a product (admin only)

export default router;
