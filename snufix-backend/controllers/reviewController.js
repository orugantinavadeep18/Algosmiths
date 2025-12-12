import Review from '../models/Review.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createReview = asyncHandler(async (req, res) => {
  const { revieweeId, taskId, rating, reviewText, category } = req.body;
  
  const review = new Review({
    reviewerId: req.userId,
    revieweeId,
    taskId,
    rating,
    reviewText,
    category
  });
  
  await review.save();
  
  // Update user rating
  const reviews = await Review.find({ revieweeId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  await User.findByIdAndUpdate(revieweeId, {
    rating: Math.round(avgRating * 10) / 10,
    totalReviews: reviews.length
  });
  
  res.status(201).json({ success: true, message: 'Review created', review });
});

export const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ revieweeId: req.params.userId })
    .populate('reviewerId', 'fullName profilePicture');
  
  res.json({ success: true, reviews });
});

export const getTaskReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ taskId: req.params.taskId })
    .populate('reviewerId revieweeId', 'fullName profilePicture');
  
  res.json({ success: true, reviews });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.reviewId,
    req.body,
    { new: true }
  );
  
  res.json({ success: true, message: 'Review updated', review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.reviewId);
  
  res.json({ success: true, message: 'Review deleted' });
});
