import Application from '../models/Application.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const applyForTask = asyncHandler(async (req, res) => {
  const { taskId, message } = req.body;
  
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  
  const user = await User.findById(req.userId);
  
  const application = new Application({
    taskId,
    applicantId: req.userId,
    message,
    applicantInfo: {
      name: user.fullName,
      rating: user.rating,
      reviews: user.totalReviews,
      completed: user.completedTasks,
      completionRate: user.completionRate,
      skills: user.skills,
      verified: user.verifiedBadges,
      badge: user.badge
    }
  });
  
  await application.save();
  await Task.findByIdAndUpdate(taskId, { $push: { applications: application._id } });
  
  res.status(201).json({ success: true, message: 'Application submitted', application });
});

export const getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ taskId: req.params.taskId })
    .populate('applicantId', 'fullName profilePicture rating');
  
  res.json({ success: true, applications });
});

export const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicantId: req.params.userId })
    .populate('taskId');
  
  res.json({ success: true, applications });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicantId: req.userId })
    .populate('taskId')
    .sort({ appliedAt: -1 });
  
  res.json({ success: true, applications });
});

export const acceptApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndUpdate(
    req.params.appId,
    { status: 'accepted', acceptedAt: Date.now() },
    { new: true }
  );
  
  await Task.findByIdAndUpdate(application.taskId, { 
    acceptedApplication: application._id,
    status: 'in-progress'
  });
  
  res.json({ success: true, message: 'Application accepted', application });
});

export const rejectApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndUpdate(
    req.params.appId,
    { status: 'rejected' },
    { new: true }
  );
  
  res.json({ success: true, message: 'Application rejected', application });
});

export const completeApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndUpdate(
    req.params.appId,
    { status: 'completed', completedAt: Date.now() },
    { new: true }
  );
  
  await Task.findByIdAndUpdate(application.taskId, { 
    status: 'completed',
    completedAt: Date.now()
  });
  
  // Update user stats
  const user = await User.findById(application.applicantId);
  user.completedTasks += 1;
  user.completionRate = Math.round((user.completedTasks / (user.completedTasks + 5)) * 100);
  await user.save();
  
  res.json({ success: true, message: 'Task completed', application });
});
