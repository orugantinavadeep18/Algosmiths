# Snufix Backend API

Complete backend API for Snufix task marketplace application built with Node.js, Express, MongoDB, and ImageKit.

## 🚀 Features

- User Authentication (Clerk + JWT)
- Task Management (CRUD)
- Task Applications & Acceptance
- Posts & Stories
- Real-time Messaging
- User Connections & Following
- Reviews & Ratings
- Image Upload (ImageKit)
- Search & Discovery

## 📦 Installation

```bash
npm install
```

## 🔧 Configuration

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://nagireddiyashaswini_db_user:Algosmiths123@cluster0.ksmoit7.mongodb.net/snufix-db
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/9ywuh26sp
FRONTEND_URL=http://localhost:5173
```

## 🚀 Running the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:5000`

## 📚 API Documentation

### Authentication Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/sync-clerk` - Sync Clerk user
- `GET /api/auth/verify` - Verify token

### User Routes
- `GET /api/users/:userId` - Get profile
- `PUT /api/users/:userId` - Update profile
- `POST /api/users/:userId/follow` - Follow user
- `GET /api/users/:userId/followers` - Get followers

### Task Routes
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:taskId` - Get task details
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

### Application Routes
- `POST /api/applications` - Apply for task
- `GET /api/applications/task/:taskId` - Get applications
- `POST /api/applications/:appId/accept` - Accept application

### Post Routes
- `POST /api/posts` - Create post
- `GET /api/posts` - Get feed
- `POST /api/posts/:postId/like` - Like post
- `POST /api/posts/:postId/comment` - Add comment

### Message Routes
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/conversations/:toUserId` - Get chat history

### Upload Routes
- `POST /api/upload/profile` - Upload profile photo
- `POST /api/upload/task` - Upload task images
- `POST /api/upload/post` - Upload post images

## 📁 Project Structure

```
snufix-backend/
├── config/
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── logger.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Task.js
│   ├── Application.js
│   ├── Post.js
│   ├── Message.js
│   ├── Connection.js
│   └── Review.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── taskController.js
│   ├── applicationController.js
│   ├── postController.js
│   ├── messageController.js
│   ├── connectionController.js
│   ├── reviewController.js
│   ├── uploadController.js
│   └── searchController.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── tasks.js
│   ├── applications.js
│   ├── posts.js
│   ├── messages.js
│   ├── connections.js
│   ├── reviews.js
│   ├── uploads.js
│   └── search.js
├── utils/
├── constants/
├── server.js
├── .env
├── .gitignore
└── package.json
```

## 🔐 Authentication

Uses JWT tokens with Clerk authentication. Include token in Authorization header:

```
Authorization: Bearer <token>
```

## 🖼️ ImageKit Integration

All image uploads use ImageKit. Configuration:
- Public Key: `your_imagekit_public_key`
- Private Key: `your_imagekit_private_key`
- URL Endpoint: `https://ik.imagekit.io/9ywuh26sp`

## 📊 Database

MongoDB Atlas connection with the following collections:
- Users
- Tasks
- Applications
- Posts
- Messages
- Connections
- Reviews

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT
