import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { getUsers } from '../utils/jsonData.js';

// Middleware to protect routes by verifying the user's token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the http-only cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const users = await getUsers();
      req.user = users.find(u => u._id === decoded.userId);
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      
      // Remove password from user object before passing to next middleware
      const userWithoutPassword = { ...req.user };
      delete userWithoutPassword.password;
      
      req.user = userWithoutPassword;
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

export { protect, admin };