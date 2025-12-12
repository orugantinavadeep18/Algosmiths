import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  message: String,
  
  applicantInfo: {
    name: String,
    rating: Number,
    reviews: Number,
    completed: Number,
    completionRate: Number,
    distance: String,
    skills: [String],
    verified: [String],
    badge: String
  },
  
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  
  appliedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  completedAt: Date
});

export default mongoose.model('Application', applicationSchema);
