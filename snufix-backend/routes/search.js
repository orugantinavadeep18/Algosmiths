import express from 'express';
import {
  searchTasks,
  searchUsers,
  discoverPage,
  getTrending,
  getRecommended
} from '../controllers/searchController.js';
import { optionalAuth, verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/tasks', searchTasks);
router.get('/users', searchUsers);
router.get('/discover', discoverPage);
router.get('/trending', getTrending);
router.get('/recommended/:userId', verifyToken, getRecommended);

export default router;
