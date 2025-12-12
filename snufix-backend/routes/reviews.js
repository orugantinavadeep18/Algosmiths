import express from 'express';
import {
  createReview,
  getUserReviews,
  getTaskReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createReview);
router.get('/user/:userId', getUserReviews);
router.get('/task/:taskId', getTaskReviews);
router.put('/:reviewId', verifyToken, updateReview);
router.delete('/:reviewId', verifyToken, deleteReview);

export default router;
