import Task from '../models/Task.js';
import Application from '../models/Application.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createTask = asyncHandler(async (req, res) => {
  const { taskCategory, taskType, taskDescription, location, paymentAmount, fullName, phoneNumber, additionalNotes, images } = req.body;
  
  const task = new Task({
    postedBy: req.userId,
    taskCategory,
    taskType,
    taskDescription,
    location,
    paymentAmount,
    fullName,
    phoneNumber,
    additionalNotes,
    images: images || []
  });
  
  await task.save();
  
  res.status(201).json({ success: true, message: 'Task created', task });
});

export const getTasks = asyncHandler(async (req, res) => {
  const { category, search, sort } = req.query;
  
  let filter = { status: 'active' };
  
  if (category) filter.taskCategory = category;
  if (search) filter.$or = [
    { taskDescription: { $regex: search, $options: 'i' } },
    { location: { $regex: search, $options: 'i' } }
  ];
  
  let query = Task.find(filter).populate('postedBy', 'fullName profilePicture rating');
  
  if (sort === 'recent') query = query.sort({ createdAt: -1 });
  if (sort === 'popular') query = query.sort({ views: -1 });
  
  const tasks = await query;
  
  res.json({ success: true, tasks });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('postedBy selectedWorker applications');
  
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  
  res.json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    { ...req.body, updatedAt: Date.now() },
    { new: true }
  );
  
  res.json({ success: true, message: 'Task updated', task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  await Task.findByIdAndDelete(req.params.taskId);
  
  res.json({ success: true, message: 'Task deleted' });
});

export const getUserTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ postedBy: req.params.userId }).sort({ createdAt: -1 });
  
  res.json({ success: true, tasks });
});

export const getTasksByCategory = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ taskCategory: req.params.category, status: 'active' });
  
  res.json({ success: true, tasks });
});

export const getTrendingTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ status: 'active' }).sort({ views: -1, createdAt: -1 }).limit(10);
  
  res.json({ success: true, tasks });
});
// Get all tasks posted by the current user
export const getMyPostedTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ postedBy: req.userId })
    .populate('applications')
    .populate('selectedWorker', 'fullName username email')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, tasks });
});

// Get applications for a specific task
export const getTaskApplications = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const task = await Task.findById(taskId)
    .populate({
      path: 'applications',
      populate: { path: 'applicantId', select: 'fullName username email profilePicture rating' }
    })
    .populate('selectedWorker', 'fullName username email profilePicture rating');
  
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  
  // Verify ownership
  if (task.postedBy.toString() !== req.userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  
  res.json({ success: true, task, applications: task.applications });
});

// Select a worker for a task
export const selectWorker = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { workerId } = req.body;
  
  const task = await Task.findById(taskId).populate('postedBy');
  
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  
  // Verify ownership
  if (task.postedBy._id.toString() !== req.userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  
  // Check if worker applied for this task
  const application = await Application.findOne({
    taskId: taskId,
    applicantId: workerId
  });
  
  if (!application) {
    return res.status(400).json({ success: false, message: 'Worker did not apply for this task' });
  }
  
  // Update application status to accepted
  application.status = 'accepted';
  application.acceptedAt = new Date();
  await application.save();
  
  // Update task
  task.selectedWorker = workerId;
  task.acceptedApplication = application._id;
  task.workStatus = 'in-progress';
  await task.save();
  
  res.json({ 
    success: true, 
    message: 'Worker selected successfully',
    task: await task.populate('selectedWorker', 'fullName username email profilePicture rating')
  });
});

// Update task work status
export const updateTaskWorkStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { workStatus } = req.body;
  
  const task = await Task.findById(taskId);
  
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  
  // Verify ownership or worker
  if (task.postedBy.toString() !== req.userId && task.selectedWorker?.toString() !== req.userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  
  task.workStatus = workStatus;
  if (workStatus === 'completed') {
    task.completedAt = new Date();
  }
  
  await task.save();
  
  res.json({ success: true, message: 'Task status updated', task });
});

export const completeTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const task = await Task.findById(taskId).populate('postedBy selectedWorker');
  
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
  
  // Verify ownership (task poster can complete)
  if (task.postedBy._id.toString() !== req.userId) {
    return res.status(403).json({ success: false, message: 'Only task poster can complete task' });
  }
  
  task.status = 'completed';
  task.workStatus = 'completed';
  task.completedAt = new Date();
  
  await task.save();
  
  res.json({ success: true, message: 'Task completed successfully', task });
});

export const getNearbyTasks = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 5 } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
  }
  
  // Find tasks within specified radius (in km)
  // Using MongoDB geospatial queries
  const tasks = await Task.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    },
    status: 'active'
  })
  .populate('postedBy', 'fullName email phone profilePicture')
  .sort({ createdAt: -1 })
  .limit(50);
  
  res.json({ success: true, tasks });
});