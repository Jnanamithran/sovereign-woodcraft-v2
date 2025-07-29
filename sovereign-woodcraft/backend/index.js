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


// --- REVISED: More Robust CORS Configuration ---

const allowedOrigins = [
  'http://localhost:5173', // Your local frontend for development
  'https://sovereign-woodcraft-v2.vercel.app' // Your Vercel frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) or from our allowed list.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This allows the frontend to send cookies with its requests.
};

// --- FIX: Handle Preflight Requests ---
// The browser sends a preflight 'OPTIONS' request to check if CORS is supported.
// This line ensures that for any route, we handle this pre-check immediately.
app.options('*', cors(corsOptions));

// Now, use the CORS options for all other requests
app.use(cors(corsOptions));


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
app.use('/uploads', express.static(uploadsDir));


// --- Root Route Handler ---
app.get('/', (req, res) => {
  res.send('API is running successfully...');
});


// --- Custom Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

// --- Start the Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
