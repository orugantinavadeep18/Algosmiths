import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  text: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  mediaUrl: String,
  
  seen: {
    type: Boolean,
    default: false
  },
  seenAt: Date,
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

export default mongoose.model('Message', messageSchema);
