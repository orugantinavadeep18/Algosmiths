import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler.js';

// Sign JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Signup
export const signup = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;
  
  // Validation
  if (!username || !email || !password || !fullName) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide username, email, password, and full name' 
    });
  }

  // Check if user already exists
  let user = await User.findOne({ $or: [{ email }, { username }] });
  
  if (user) {
    return res.status(400).json({ 
      success: false, 
      message: 'User with that email or username already exists' 
    });
  }
  
  // Create user
  user = new User({
    username,
    email,
    password,
    fullName
  });
  
  await user.save();
  
  const token = generateToken(user._id);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName
    }
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  // Validation
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide username and password' 
    });
  }
  
  // Find user by username or email
  const user = await User.findOne({ 
    $or: [{ username }, { email: username }] 
  });
  
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
  
  // Check password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
  
  // Set user as active
  user.isActive = true;
  user.lastActiveAt = new Date();
  await user.save();
  
  const token = generateToken(user._id);
  
  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive
    }
  });
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  
  if (user) {
    user.isActive = false;
    user.lastActiveAt = new Date();
    await user.save();
  }
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Verify Token
export const verifyToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive
    }
  });
});
