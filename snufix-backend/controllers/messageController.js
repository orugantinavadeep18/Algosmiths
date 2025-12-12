import Message from '../models/Message.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { taskId, toUserId, text, mediaUrl, messageType } = req.body;
  
  const message = new Message({
    taskId,
    fromUserId: req.userId,
    toUserId,
    text,
    mediaUrl,
    messageType: messageType || 'text'
  });
  
  await message.save();
  
  res.status(201).json({ success: true, message: 'Message sent', data: message });
});

export const getTaskChat = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const messages = await Message.find({ taskId })
    .populate('fromUserId toUserId', 'fullName profilePicture username')
    .sort({ createdAt: 1 });
  
  res.json({ success: true, messages });
});

export const getConversations = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { fromUserId: req.userId },
      { toUserId: req.userId }
    ]
  }).populate('fromUserId toUserId', 'fullName profilePicture');
  
  const conversations = {};
  
  messages.forEach(msg => {
    const otherId = msg.fromUserId._id.toString() === req.userId ? msg.toUserId._id : msg.fromUserId._id;
    const key = otherId.toString();
    
    if (!conversations[key]) {
      conversations[key] = msg;
    } else if (new Date(msg.createdAt) > new Date(conversations[key].createdAt)) {
      conversations[key] = msg;
    }
  });
  
  res.json({ success: true, conversations: Object.values(conversations) });
});

export const getChatHistory = asyncHandler(async (req, res) => {
  const { toUserId } = req.params;
  
  const messages = await Message.find({
    $or: [
      { fromUserId: req.userId, toUserId },
      { fromUserId: toUserId, toUserId: req.userId }
    ]
  }).sort({ createdAt: 1 });
  
  res.json({ success: true, messages });
});

export const markAsSeen = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.messageId,
    { seen: true, seenAt: Date.now() },
    { new: true }
  );
  
  res.json({ success: true, message: 'Message marked as seen', data: message });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await Message.findByIdAndDelete(req.params.messageId);
  
  res.json({ success: true, message: 'Message deleted' });
});
