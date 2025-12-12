import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getCurrentProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).populate('followers following connections');
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  res.json({ success: true, user });
});

export const getProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  // Try to find by username first, then by MongoDB _id
  let user = await User.findOne({ username: userId }).populate('followers following connections');
  
  if (!user) {
    user = await User.findById(userId).populate('followers following connections');
  }
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  res.json({ success: true, user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, bio, location, skills, phone } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    { fullName, bio, location, skills, phone, updatedAt: Date.now() },
    { new: true }
  );
  
  res.json({ success: true, message: 'Profile updated', user });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.userId, { accountStatus: 'deleted' });
  
  res.json({ success: true, message: 'Account deleted successfully' });
});

export const getUserStats = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  // Try to find by username first, then by MongoDB _id
  let user = await User.findOne({ username: userId });
  
  if (!user) {
    user = await User.findById(userId);
  }
  
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  res.json({
    success: true,
    stats: {
      rating: user.rating,
      totalReviews: user.totalReviews,
      completedTasks: user.completedTasks,
      completionRate: user.completionRate,
      level: user.level,
      xp: user.xp,
      followers: user.followers.length,
      following: user.following.length
    }
  });
});

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $push: { following: userId } },
    { new: true }
  );
  
  await User.findByIdAndUpdate(userId, { $push: { followers: req.userId } });
  
  res.json({ success: true, message: 'User followed', user });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $pull: { following: userId } },
    { new: true }
  );
  
  await User.findByIdAndUpdate(userId, { $pull: { followers: req.userId } });
  
  res.json({ success: true, message: 'User unfollowed', user });
});

export const getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).populate('followers', 'fullName profilePicture');
  
  res.json({ success: true, followers: user.followers });
});

export const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).populate('following', 'fullName profilePicture');
  
  res.json({ success: true, following: user.following });
});

export const getNearbyWorkers = asyncHandler(async (req, res) => {
  const { latitude, longitude, maxDistance = 5000 } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
  }
  
  try {
    // Find ACTIVE users within specified radius (in meters)
    // Using MongoDB geospatial queries
    const workers = await User.find({
      $and: [
        {
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
              },
              $maxDistance: parseInt(maxDistance) // In meters
            }
          }
        },
        { _id: { $ne: req.userId } }, // Exclude current user
        { accountStatus: 'active' },
        { isActive: true },
        { 'location.coordinates': { $ne: [0, 0] } } // Exclude default coordinates
      ]
    })
    .select('_id fullName username email phone location rating completedTasks profilePicture')
    .limit(50)
    .lean();

    // Format response
    const formattedWorkers = workers.map(worker => ({
      _id: worker._id,
      name: worker.fullName || worker.username,
      title: 'Worker',
      location: worker.location,
      averageRating: worker.rating || 0,
      hourlyRate: 100,
      reviews: worker.completedTasks || 0
    }));

    res.json({ 
      success: true, 
      data: formattedWorkers,
      count: formattedWorkers.length,
      message: formattedWorkers.length === 0 ? 'No active workers found in your area' : `Found ${formattedWorkers.length} workers nearby`
    });
  } catch (error) {
    console.error('Error finding nearby workers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error finding nearby workers',
      error: error.message 
    });
  }
});

export const updateUserLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude, address } = req.body;
  
  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
  }
  
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      address: address || '',
      updatedAt: Date.now()
    },
    { new: true }
  );
  
  res.json({ success: true, message: 'Location updated', user });
});
