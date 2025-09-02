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

const router = express.Router();

// Rate limiter for delete requests (admin-only)
const deleteLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 5, // limit each IP to 5 delete requests per minute
    message: "Too many delete requests, please try again later.",
    standardHeaders: true, 
    legacyHeaders: false,
});

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
    .put(protect, admin, updateProduct)    // Update a product (admin only)
    .delete(protect, admin, deleteLimiter, deleteProduct); // Delete a product (admin only, rate-limited)

export default router;
