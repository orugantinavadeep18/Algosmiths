import express from 'express';
import {
  sendConnectionRequest,
  getUserConnections,
  getPendingRequests,
  acceptConnection,
  rejectConnection,
  removeConnection
} from '../controllers/connectionController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, sendConnectionRequest);
router.get('/user/:userId', getUserConnections);
router.get('/pending/:userId', getPendingRequests);
router.put('/:connId/accept', verifyToken, acceptConnection);
router.put('/:connId/reject', verifyToken, rejectConnection);
router.delete('/:connId', verifyToken, removeConnection);

export default router;
