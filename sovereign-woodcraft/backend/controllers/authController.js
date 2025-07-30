// /backend/controllers/authController.js
import User from '../models/UserModel.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({ _id: user._id, name: user.name, email: user.email });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
