import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getUsers, writeUsers, readJsonFile, writeJsonFile } from '../utils/jsonData.js';

// Email sending function (mock for now)
const sendEmail = async (to, subject, text) => {
  console.log(`Email to ${to}: ${subject}\n${text}`);
  // In a real app, you'd use nodemailer here
  // For now, just log the email content
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const users = await getUsers();
  const userExists = users.find(u => u.email === email);
  
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate new user ID
  const maxId = users.reduce((max, u) => {
    const id = parseInt(u._id, 10);
    return id > max ? id : max;
  }, 0);

  // Create user
  const user = {
    _id: (maxId + 1).toString(),
    name,
    email,
    password, // In real app, this should be hashed with bcrypt
    isAdmin: false,
    isEmailVerified: false,
    addresses: [],
    createdAt: new Date().toISOString()
  };

  users.push(user);
  await writeUsers(users);

  // Create email verification token
  const token = crypto.randomBytes(32).toString('hex');
  const emailVerifications = await readJsonFile('emailVerifications.json');
  
  emailVerifications.push({
    user: user._id,
    email: user.email,
    token,
    type: 'email_verification',
    isUsed: false,
    createdAt: new Date().toISOString()
  });

  await writeJsonFile('emailVerifications.json', emailVerifications);

  // Send verification email
  await sendEmail(
    user.email,
    'Email Verification Required',
    `Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`
  );

  generateToken(res, user._id);
  res.status(201).json({ 
    _id: user._id, 
    name: user.name, 
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    message: 'Registration successful. Please check your email for verification link.'
  });
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const users = await getUsers();
  const user = users.find(u => u.email === email);
  
  if (user && user.password === password) { // In real app, use bcrypt.compare
    generateToken(res, user._id);
    res.json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      isAdmin: user.isAdmin
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// Additional auth functions for email verification and password reset
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  
  const emailVerifications = await readJsonFile('emailVerifications.json');
  const verification = emailVerifications.find(v => v.token === token);
  
  if (!verification) {
    res.status(400);
    throw new Error('Invalid verification token');
  }

  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === verification.user);
  
  if (userIndex === -1) {
    res.status(400);
    throw new Error('User not found');
  }

  users[userIndex].isEmailVerified = true;
  await writeUsers(users);
  
  // Remove the verification token
  const updatedVerifications = emailVerifications.filter(v => v.token !== token);
  await writeJsonFile('emailVerifications.json', updatedVerifications);

  res.json({ message: 'Email verified successfully' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const users = await getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    // Don't reveal if user exists or not for security
    res.json({ message: 'If an account with that email exists, we have sent a password reset link to it.' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  const passwordResets = await readJsonFile('passwordResets.json');
  
  // Remove any existing reset tokens for this user
  const filteredResets = passwordResets.filter(r => r.user !== user._id);
  
  filteredResets.push({
    user: user._id,
    email: user.email,
    token,
    type: 'password_reset',
    isUsed: false,
    createdAt: new Date().toISOString()
  });

  await writeJsonFile('passwordResets.json', filteredResets);

  await sendEmail(
    user.email,
    'Password Reset Request',
    `Click this link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`
  );

  res.json({ message: 'Password reset link sent to email' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  
  const passwordResets = await readJsonFile('passwordResets.json');
  const reset = passwordResets.find(r => r.token === token);
  
  if (!reset) {
    res.status(400);
    throw new Error('Invalid reset token');
  }

  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === reset.user);
  
  if (userIndex === -1) {
    res.status(400);
    throw new Error('User not found');
  }

  users[userIndex].password = password; // In real app, hash this with bcrypt
  await writeUsers(users);
  
  // Remove the reset token
  const updatedResets = passwordResets.filter(r => r.token !== token);
  await writeJsonFile('passwordResets.json', updatedResets);

  res.json({ message: 'Password reset successful' });
});