import Post from '../models/Post.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createPost = asyncHandler(async (req, res) => {
  const { content, imageUrls, postType, relatedTask, backgroundColor } = req.body;
  
  const post = new Post({
    userId: req.userId,
    content,
    imageUrls: imageUrls || [],
    postType,
    relatedTask,
    backgroundColor
  });
  
  await post.save();
  
  res.status(201).json({ success: true, message: 'Post created', post });
});

export const getFeeds = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('userId', 'fullName profilePicture level xp')
    .populate('relatedTask', 'taskCategory taskDescription')
    .sort({ createdAt: -1 })
    .limit(20);
  
  res.json({ success: true, posts });
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .populate('userId', 'fullName profilePicture')
    .populate('comments.userId', 'fullName profilePicture');
  
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }
  
  res.json({ success: true, post });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { ...req.body, updatedAt: Date.now() },
    { new: true }
  );
  
  res.json({ success: true, message: 'Post updated', post });
});

export const deletePost = asyncHandler(async (req, res) => {
  await Post.findByIdAndDelete(req.params.postId);
  
  res.json({ success: true, message: 'Post deleted' });
});

export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { $push: { likes: req.userId } },
    { new: true }
  );
  
  res.json({ success: true, message: 'Post liked', post });
});

export const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { $pull: { likes: req.userId } },
    { new: true }
  );
  
  res.json({ success: true, message: 'Post unliked', post });
});

export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  
  const post = await Post.findByIdAndUpdate(
    req.params.postId,
    { $push: { comments: { userId: req.userId, text } } },
    { new: true }
  ).populate('comments.userId', 'fullName profilePicture');
  
  res.json({ success: true, message: 'Comment added', post });
});

export const getComments = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .populate('comments.userId', 'fullName profilePicture');
  
  res.json({ success: true, comments: post.comments });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  
  const post = await Post.findByIdAndUpdate(
    postId,
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  );
  
  res.json({ success: true, message: 'Comment deleted', post });
});
