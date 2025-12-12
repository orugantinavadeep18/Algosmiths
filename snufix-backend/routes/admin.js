import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: 'completed' });
  const activeTasks = await Task.countDocuments({ status: 'active' });
  
  // Get users by status
  const users = await User.find()
    .select('username email fullName isActive completedTasks rating level createdAt')
    .sort({ createdAt: -1 });
  
  // Get recent tasks
  const recentTasks = await Task.find()
    .select('title status budget createdAt postedBy')
    .limit(10)
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    analytics: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalTasks,
      completedTasks,
      activeTasks,
      pendingTasks: totalTasks - completedTasks - activeTasks,
      activePercentage: ((activeUsers / totalUsers) * 100).toFixed(2),
      completionRate: ((completedTasks / totalTasks) * 100).toFixed(2)
    },
    users,
    recentTasks
  });
}));

// Get all users with detailed info
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: users.length,
    users
  });
}));

// Get user details by ID
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  res.json({
    success: true,
    user
  });
}));

// Toggle user active status
router.put('/users/:id/status', asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive, lastActiveAt: new Date() },
    { new: true }
  );
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  res.json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    user
  });
}));

// Delete user
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

// Get active users for map
router.get('/active-users', asyncHandler(async (req, res) => {
  const activeUsers = await User.find({ isActive: true })
    .select('username fullName email rating completedTasks hourlyRate location')
    .limit(100);
  
  res.json({
    success: true,
    count: activeUsers.length,
    users: activeUsers
  });
}));

export default router;
