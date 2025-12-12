import express from 'express';
import {
  createPost,
  getFeeds,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getComments,
  deleteComment
} from '../controllers/postController.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createPost);
router.get('/', optionalAuth, getFeeds);
router.get('/:postId', getPostById);
router.put('/:postId', verifyToken, updatePost);
router.delete('/:postId', verifyToken, deletePost);
router.post('/:postId/like', verifyToken, likePost);
router.post('/:postId/unlike', verifyToken, unlikePost);
router.post('/:postId/comment', verifyToken, addComment);
router.get('/:postId/comments', getComments);
router.delete('/:postId/comments/:commentId', verifyToken, deleteComment);

export default router;
