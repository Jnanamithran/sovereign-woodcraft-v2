import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js';

// Middleware to protect routes by verifying the user's token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the http-only cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next(); // Move to the next middleware or controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// ✅ ADD THIS MIDDLEWARE FUNCTION
// Middleware to check if the user is an admin
const admin = (req, res, next) => {
  // This middleware should run AFTER the 'protect' middleware
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// ✅ MAKE SURE YOU EXPORT BOTH FUNCTIONS
export { protect, admin };