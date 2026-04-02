import asyncHandler from '../middleware/asyncHandler.js';
import crypto from 'crypto';
import { getUsers, writeUsers, readJsonFile, writeJsonFile } from '../utils/jsonData.js';

// Helper functions
const findUserById = (users, id) => {
  return users.find(u => u._id === id);
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const users = await getUsers();
  const user = findUserById(users, req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      addresses: user.addresses || [],
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === req.user._id);

  if (userIndex !== -1) {
    const user = users[userIndex];
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password; // In real app, hash this with bcrypt
    }

    await writeUsers(users);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
export const getUserAddresses = asyncHandler(async (req, res) => {
  const users = await getUsers();
  const user = findUserById(users, req.user._id);

  if (user) {
    res.json({
      addresses: user.addresses || [],
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
export const addUserAddress = asyncHandler(async (req, res) => {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === req.user._id);
  const { address, city, postalCode, country, isDefault } = req.body;

  if (userIndex !== -1) {
    const user = users[userIndex];
    const newAddress = {
      _id: Math.random().toString(36).substr(2, 9), // Simple ID generator
      address,
      city,
      postalCode,
      country,
      isDefault: isDefault || false
    };

    // If this is set as default, unset all other defaults
    if (isDefault) {
      user.addresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }

    user.addresses.push(newAddress);
    await writeUsers(users);

    res.status(201).json({
      address: newAddress
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user address
// @route   PUT /api/users/addresses/:id
// @access  Private
export const updateUserAddress = asyncHandler(async (req, res) => {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === req.user._id);
  const { id } = req.params;
  const { address, city, postalCode, country, isDefault } = req.body;

  if (userIndex !== -1) {
    const user = users[userIndex];
    const addressIndex = user.addresses.findIndex(addr => addr._id === id);

    if (addressIndex > -1) {
      // If this is set as default, unset all other defaults
      if (isDefault) {
        user.addresses = user.addresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }

      user.addresses[addressIndex] = {
        ...user.addresses[addressIndex],
        address: address || user.addresses[addressIndex].address,
        city: city || user.addresses[addressIndex].city,
        postalCode: postalCode || user.addresses[addressIndex].postalCode,
        country: country || user.addresses[addressIndex].country,
        isDefault: isDefault ?? user.addresses[addressIndex].isDefault
      };

      await writeUsers(users);

      res.json({
        address: user.addresses[addressIndex]
      });
    } else {
      res.status(404);
      throw new Error('Address not found');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:id
// @access  Private
export const deleteUserAddress = asyncHandler(async (req, res) => {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === req.user._id);
  const { id } = req.params;

  if (userIndex !== -1) {
    const user = users[userIndex];
    const addressIndex = user.addresses.findIndex(addr => addr._id === id);

    if (addressIndex > -1) {
      user.addresses.splice(addressIndex, 1);
      await writeUsers(users);
      res.json({ message: 'Address removed' });
    } else {
      res.status(404);
      throw new Error('Address not found');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Set default address
// @route   PUT /api/users/addresses/:id/default
// @access  Private
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === req.user._id);
  const { id } = req.params;

  if (userIndex !== -1) {
    const user = users[userIndex];
    user.addresses = user.addresses.map(addr => ({
      ...addr,
      isDefault: addr._id === id
    }));

    await writeUsers(users);
    res.json({ message: 'Default address updated' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Verify email
// @route   POST /api/users/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const emailVerifications = await readJsonFile('emailVerifications.json');
  const verification = emailVerifications.find(v => v.token === token);

  if (!verification) {
    res.status(400);
    throw new Error('Invalid or expired verification token');
  }

  if (verification.isUsed) {
    res.status(400);
    throw new Error('Verification token has already been used');
  }

  if (verification.type !== 'email_verification') {
    res.status(400);
    throw new Error('Invalid verification token type');
  }

  // Update user email verification status
  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === verification.user);

  if (userIndex === -1) {
    res.status(404);
    throw new Error('User not found');
  }

  users[userIndex].isEmailVerified = true;
  await writeUsers(users);

  // Mark verification as used
  verification.isUsed = true;
  await writeJsonFile('emailVerifications.json', emailVerifications);

  res.json({ message: 'Email verified successfully' });
});

// @desc    Send email verification
// @route   POST /api/users/send-verification
// @access  Private
export const sendVerificationEmail = asyncHandler(async (req, res) => {
  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === req.user._id);

  if (userIndex === -1) {
    res.status(404);
    throw new Error('User not found');
  }

  const user = users[userIndex];

  if (user.isEmailVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  // Delete any existing verification tokens for this user
  let emailVerifications = await readJsonFile('emailVerifications.json');
  emailVerifications = emailVerifications.filter(v => !(v.user === user._id && v.type === 'email_verification'));

  // Create new verification token
  const token = crypto.randomBytes(32).toString('hex');
  const verification = {
    user: user._id,
    email: user.email,
    token,
    type: 'email_verification',
    isUsed: false,
    createdAt: new Date().toISOString()
  };

  emailVerifications.push(verification);
  await writeJsonFile('emailVerifications.json', emailVerifications);

  // Send verification email (mock)
  console.log(`Verification email to ${user.email}: Please verify your email by clicking this link: ${process.env.FRONTEND_URL}/verify-email?token=${token}`);

  res.json({ message: 'Verification email sent' });
});

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const users = await getUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    // Don't reveal if user exists or not for security
    res.json({ message: 'If an account with that email exists, we have sent a password reset link to it.' });
    return;
  }

  // Delete any existing password reset tokens for this user
  let passwordResets = await readJsonFile('passwordResets.json');
  passwordResets = passwordResets.filter(r => !(r.user === user._id && r.type === 'password_reset'));

  // Create new password reset token
  const token = crypto.randomBytes(32).toString('hex');
  const reset = {
    user: user._id,
    email: user.email,
    token,
    type: 'password_reset',
    isUsed: false,
    createdAt: new Date().toISOString()
  };

  passwordResets.push(reset);
  await writeJsonFile('passwordResets.json', passwordResets);

  // Send password reset email (mock)
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log(`Password reset email to ${user.email}: You requested a password reset. Click this link to reset your password: ${resetUrl}`);

  res.json({ message: 'If an account with that email exists, we have sent a password reset link to it.' });
});

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const passwordResets = await readJsonFile('passwordResets.json');
  const reset = passwordResets.find(r => r.token === token);

  if (!reset) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  if (reset.isUsed) {
    res.status(400);
    throw new Error('Reset token has already been used');
  }

  if (reset.type !== 'password_reset') {
    res.status(400);
    throw new Error('Invalid reset token type');
  }

  // Update user password
  const users = await getUsers();
  const userIndex = users.findIndex(u => u._id === reset.user);

  if (userIndex === -1) {
    res.status(404);
    throw new Error('User not found');
  }

  users[userIndex].password = password; // In real app, hash this with bcrypt
  await writeUsers(users);

  // Mark reset as used
  reset.isUsed = true;
  await writeJsonFile('passwordResets.json', passwordResets);

  res.json({ message: 'Password reset successfully' });
});