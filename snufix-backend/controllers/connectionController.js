import Connection from '../models/Connection.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const sendConnectionRequest = asyncHandler(async (req, res) => {
  const { receiverId } = req.body;
  
  const existing = await Connection.findOne({
    $or: [
      { senderId: req.userId, receiverId },
      { senderId: receiverId, receiverId: req.userId }
    ]
  });
  
  if (existing) {
    return res.status(400).json({ success: false, message: 'Connection already exists' });
  }
  
  const connection = new Connection({
    senderId: req.userId,
    receiverId
  });
  
  await connection.save();
  
  res.status(201).json({ success: true, message: 'Connection request sent', connection });
});

export const getUserConnections = asyncHandler(async (req, res) => {
  const connections = await Connection.find({
    $or: [
      { senderId: req.params.userId, status: 'accepted' },
      { receiverId: req.params.userId, status: 'accepted' }
    ]
  }).populate('senderId receiverId', 'fullName profilePicture');
  
  res.json({ success: true, connections });
});

export const getPendingRequests = asyncHandler(async (req, res) => {
  const connections = await Connection.find({
    receiverId: req.params.userId,
    status: 'pending'
  }).populate('senderId', 'fullName profilePicture');
  
  res.json({ success: true, connections });
});

export const acceptConnection = asyncHandler(async (req, res) => {
  const connection = await Connection.findByIdAndUpdate(
    req.params.connId,
    { status: 'accepted' },
    { new: true }
  );
  
  res.json({ success: true, message: 'Connection accepted', connection });
});

export const rejectConnection = asyncHandler(async (req, res) => {
  const connection = await Connection.findByIdAndUpdate(
    req.params.connId,
    { status: 'rejected' },
    { new: true }
  );
  
  res.json({ success: true, message: 'Connection rejected', connection });
});

export const removeConnection = asyncHandler(async (req, res) => {
  await Connection.findByIdAndDelete(req.params.connId);
  
  res.json({ success: true, message: 'Connection removed' });
});
