import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: String,
  phoneNumber: String,
  
  taskCategory: {
    type: String,
    required: true
  },
  taskType: String,
  taskDescription: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  paymentAmount: {
    type: Number,
    required: true
  },
  additionalNotes: String,
  
  status: {
    type: String,
    enum: ['active', 'in-progress', 'completed', 'cancelled'],
    default: 'active'
  },
  
  images: [String],
  
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  acceptedApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  
  selectedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  workStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

export default mongoose.model('Task', taskSchema);
