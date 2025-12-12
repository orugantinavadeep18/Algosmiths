import express from 'express';
import {
  applyForTask,
  getApplications,
  getUserApplications,
  getMyApplications,
  acceptApplication,
  rejectApplication,
  completeApplication
} from '../controllers/applicationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, applyForTask);
router.get('/my-applications', verifyToken, getMyApplications);
router.get('/task/:taskId', getApplications);
router.get('/user/:userId', getUserApplications);
router.put('/:appId/accept', verifyToken, acceptApplication);
router.put('/:appId/reject', verifyToken, rejectApplication);
router.put('/:appId/complete', verifyToken, completeApplication);

export default router;
