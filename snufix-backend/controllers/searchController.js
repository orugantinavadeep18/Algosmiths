import Task from '../models/Task.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const searchTasks = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, location } = req.query;
  
  let filter = { status: 'active' };
  
  if (q) {
    filter.$or = [
      { taskDescription: { $regex: q, $options: 'i' } },
      { taskCategory: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } }
    ];
  }
  
  if (category) filter.taskCategory = category;
  if (location) filter.location = { $regex: location, $options: 'i' };
  
  if (minPrice || maxPrice) {
    filter.paymentAmount = {};
    if (minPrice) filter.paymentAmount.$gte = parseInt(minPrice);
    if (maxPrice) filter.paymentAmount.$lte = parseInt(maxPrice);
  }
  
  const tasks = await Task.find(filter).populate('postedBy', 'fullName profilePicture rating');
  
  res.json({ success: true, tasks });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  const users = await User.find({
    $or: [
      { fullName: { $regex: q, $options: 'i' } },
      { username: { $regex: q, $options: 'i' } },
      { bio: { $regex: q, $options: 'i' } }
    ]
  });
  
  res.json({ success: true, users });
});

export const discoverPage = asyncHandler(async (req, res) => {
  const trendingTasks = await Task.find({ status: 'active' }).sort({ views: -1 }).limit(5);
  const topRatedUsers = await User.find({ accountStatus: 'active' }).sort({ rating: -1 }).limit(5);
  const recentTasks = await Task.find({ status: 'active' }).sort({ createdAt: -1 }).limit(5);
  
  res.json({
    success: true,
    discover: {
      trending: trendingTasks,
      topRated: topRatedUsers,
      recent: recentTasks
    }
  });
});

export const getTrending = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ status: 'active' })
    .sort({ views: -1, createdAt: -1 })
    .limit(15)
    .populate('postedBy', 'fullName profilePicture');
  
  res.json({ success: true, tasks });
});

export const getRecommended = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  
  const tasks = await Task.find({
    status: 'active',
    taskCategory: { $in: user.skills },
    postedBy: { $ne: req.params.userId }
  }).limit(10);
  
  res.json({ success: true, tasks });
});
