import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import all your route files
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();
connectDB();

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://sovereign-woodcraft-v2.vercel.app'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
 * =================================================================
 * DEBUGGING STEP: Isolate the problematic route file.
 * =================================================================
 * We will comment out these routes one by one to find the error.
 *
 * TO DEBUG:
 * 1. Save this file exactly as it is.
 * 2. In your terminal, run `npm start`. It will still fail.
 * 3. NOW, comment out the FIRST line below (`app.use('/api/products', ...)`).
 * 4. Save the file and run `npm start` again.
 * - If the server STARTS, the error is in `productRoutes.js`.
 * - If the server still FAILS, the error is not in that file.
 * 5. Undo your change (uncomment the line) and repeat the process for the next line (`app.use('/api/auth', ...)`).
 *
 * This process will tell you exactly which file has the typo.
 * =================================================================
 */
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


// --- Static File Serving & Root Handler ---
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.get('/', (req, res) => res.send('API is running successfully...'));


// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
