import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// --- FIX: Updated CORS Configuration for Vercel ---
// This list contains the URLs that are allowed to make requests to your API.
const allowedOrigins = [
  'http://localhost:5173', // Your local frontend for development
  // IMPORTANT: Replace this placeholder with your actual Vercel frontend URL
  'https://sovereign-woodcraft-v2.vercel.app' 
];

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // If the request origin is in our allowed list, allow it.
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allows cookies and authorization headers to be sent
}));

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads

// --- API Routes ---
// All your specific API endpoints are defined here.
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// --- Static File Serving ---
const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, '/uploads');

// Check if the 'uploads' directory exists, if not, create it.
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Serve the 'uploads' directory as a static folder.
// This allows you to access uploaded files directly via URL (e.g., http://localhost:5001/uploads/image.jpg)
app.use('/uploads', express.static(uploadsDir));


// --- Root Route Handler ---
// This tells the server what to do when someone visits the base URL (e.g., "https://your-app.onrender.com/")
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});


// --- Custom Error Handling Middleware ---
// These must be last, after all other routes and middleware.
app.use(notFound); // Handles requests for routes that don't exist (404 Not Found)
app.use(errorHandler); // A general-purpose error handler for other server errors

// --- Start the Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
