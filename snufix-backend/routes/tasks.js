import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUserTasks,
  getTasksByCategory,
  getTrendingTasks,
  getMyPostedTasks,
  getTaskApplications,
  selectWorker,
  updateTaskWorkStatus,
  completeTask,
  getNearbyTasks
} from '../controllers/taskController.js';
import { verifyToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createTask);
router.get('/', optionalAuth, getTasks);
router.post('/nearby', verifyToken, getNearbyTasks);
router.get('/my-tasks', verifyToken, getMyPostedTasks);
router.get('/category/:category', getTasksByCategory);
router.get('/trending', getTrendingTasks);
router.get('/:taskId/applications', verifyToken, getTaskApplications);
router.post('/:taskId/select-worker', verifyToken, selectWorker);
router.put('/:taskId/work-status', verifyToken, updateTaskWorkStatus);
router.put('/:taskId/complete', verifyToken, completeTask);
router.get('/user/:userId', getUserTasks);
router.get('/:taskId', optionalAuth, getTaskById);
router.put('/:taskId', verifyToken, updateTask);
router.delete('/:taskId', verifyToken, deleteTask);
export default router;