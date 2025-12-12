import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import applicationRoutes from './routes/applications.js';
import postRoutes from './routes/posts.js';
import messageRoutes from './routes/messages.js';
import connectionRoutes from './routes/connections.js';
import reviewRoutes from './routes/reviews.js';
import uploadRoutes from './routes/uploads.js';
import searchRoutes from './routes/search.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:3000'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(logger);

// Database Connection with Retry Logic
let mongoConnected = false;
let retryCount = 0;
const connectMongoDB = async () => {
  retryCount++;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true
    });
    console.log('✅ MongoDB connected successfully');
    mongoConnected = true;
    retryCount = 0; // Reset on success
  } catch (err) {
    if (retryCount === 1) {
      console.log('⚠️  MongoDB connection failed');
      console.log('❌ Error:', err.message);
      console.log('   To fix:');
      console.log('   1. Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access');
      console.log('   2. Verify credentials in .env file');
      console.log('   3. Check if cluster is ACTIVE (not paused)');
    }
    mongoConnected = false;
    // Retry connection every 30 seconds (less noisy)
    setTimeout(connectMongoDB, 30000);
  }
};

connectMongoDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});
