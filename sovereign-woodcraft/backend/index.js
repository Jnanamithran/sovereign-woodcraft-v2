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

// This list contains the URLs that are allowed to make requests to your API.
const allowedOrigins = [
  'http://localhost:5173', // Your local frontend for development
  'https://sovereign-woodcraft-v2.vercel.app' // Your Vercel frontend URL
];

// We configure CORS here. This is like a security guard for your API.
app.use(cors({
  // The 'origin' property tells the security guard who is allowed to talk to the API.
  origin: function (origin, callback) {
    // 'origin' is the URL of the website making the request (e.g., your Vercel app).
    
    // We check if the incoming 'origin' is in our 'allowedOrigins' list.
    // We also allow requests that don't have an origin (like from Postman or other tools).
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      // If the origin is in our list (or if there's no origin), we allow the request.
      // The 'callback(null, true)' means "no error, access is granted."
      callback(null, true);
    } else {
      // If the origin is NOT in our list, we block the request.
      // The 'callback(new Error(...))' means "there was an error, access is denied."
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This allows the frontend to send cookies with its requests.
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
