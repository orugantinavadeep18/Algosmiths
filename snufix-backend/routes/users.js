import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteAccount,
  getUserStats,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getCurrentProfile,
  getNearbyWorkers,
  updateUserLocation
} from '../controllers/userController.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get current logged-in user profile
router.get('/profile', verifyToken, getCurrentProfile);

// Location-based endpoints
router.post('/nearby/workers', verifyToken, getNearbyWorkers);
router.put('/location', verifyToken, updateUserLocation);

// Get any user profile by ID
router.get('/:userId', optionalAuth, getProfile);
router.put('/:userId', verifyToken, updateProfile);
router.delete('/:userId', verifyToken, deleteAccount);
router.get('/:userId/stats', getProfile);
router.post('/:userId/follow', verifyToken, followUser);
router.post('/:userId/unfollow', verifyToken, unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

export default router;
