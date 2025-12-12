import express from 'express';
import {
  sendMessage,
  getConversations,
  getChatHistory,
  getTaskChat,
  markAsSeen,
  deleteMessage
} from '../controllers/messageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage);
router.get('/conversations', verifyToken, getConversations);
router.get('/task/:taskId', verifyToken, getTaskChat);
router.get('/conversations/:toUserId', verifyToken, getChatHistory);
router.put('/:messageId/seen', verifyToken, markAsSeen);
router.delete('/:messageId', verifyToken, deleteMessage);

export default router;
