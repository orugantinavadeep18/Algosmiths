import express from 'express';
import jwt from 'jsonwebtoken';
import { signup, login, logout, verifyToken } from '../controllers/authController.js';
import { verifyToken as verify } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', verify, logout);
router.get('/verify', verify, verifyToken);

// Admin login (separate route with hardcoded credentials)
router.post('/admin-login', (req, res) => {
  const { username, password } = req.body;
  
  // Hardcoded admin credentials
  const ADMIN_USERNAME = 'Algosmiths';
  const ADMIN_PASSWORD = 'Alogosmiths123';
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { id: 'admin', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    return res.json({
      success: true,
      message: 'Admin logged in successfully',
      token,
      user: {
        id: 'admin',
        username: 'Algosmiths',
        role: 'admin'
      }
    });
  }
  
  res.status(401).json({
    success: false,
    message: 'Invalid admin credentials'
  });
});

export default router;
