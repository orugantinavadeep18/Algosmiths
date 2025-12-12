# Complete API Endpoints Reference

## 🔐 Authentication Endpoints

### POST /api/auth/signup
Register a new user
```
Request:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

### POST /api/auth/login
Login user
```
Request:
{
  "username": "johndoe",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

### GET /api/auth/verify
Verify JWT token (requires Authorization header)
```
Request Header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

---

## 👤 User Endpoints

### GET /api/users/profile
Get logged-in user's profile (requires token)
```
Request Header:
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "bio": "I love coding",
    "location": "New York",
    "profilePicture": "https://...",
    "rating": 4.5,
    "totalReviews": 10,
    "completedTasks": 25,
    "followers": [],
    "following": []
  }
}
```

### GET /api/users/:userId
Get any user's profile (by ID or username)
```
Request:
GET /api/users/johndoe
or
GET /api/users/507f1f77bcf86cd799439011

Response:
{
  "success": true,
  "user": { ... }
}
```

### PUT /api/users/:userId
Update user profile (requires token)
```
Request Header:
Authorization: Bearer <token>

Request Body:
{
  "fullName": "John Doe",
  "bio": "Updated bio",
  "location": "New York",
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "message": "Profile updated",
  "user": { ... }
}
```

### GET /api/users/:userId/stats
Get user statistics
```
Response:
{
  "success": true,
  "stats": {
    "rating": 4.5,
    "totalReviews": 10,
    "completedTasks": 25,
    "completionRate": 85,
    "level": 5,
    "xp": 1250,
    "followers": 15,
    "following": 20
  }
}
```

### POST /api/users/:userId/follow
Follow a user (requires token)
```
Request Header:
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "User followed",
  "user": { ... }
}
```

### POST /api/users/:userId/unfollow
Unfollow a user (requires token)

### GET /api/users/:userId/followers
Get user's followers

### GET /api/users/:userId/following
Get users that user is following

---

## 📋 Task Endpoints

### POST /api/tasks
Create a new task (requires token)
```
Request Header:
Authorization: Bearer <token>

Request Body:
{
  "taskCategory": "Home & Garden",
  "taskDescription": "Need help with garden cleaning",
  "taskType": "One-time",
  "location": "New York, NY",
  "paymentAmount": 100,
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "additionalNotes": "Preferred time: weekend"
}

Response:
{
  "success": true,
  "message": "Task created",
  "task": {
    "_id": "507f1f77bcf86cd799439011",
    "taskCategory": "Home & Garden",
    "taskDescription": "...",
    "taskType": "One-time",
    "location": "New York, NY",
    "paymentAmount": 100,
    "status": "active",
    "postedBy": "507f1f77bcf86cd799439012",
    "createdAt": "2024-12-11T10:00:00.000Z"
  }
}
```

### GET /api/tasks
Get all tasks
```
Query Parameters:
?category=Technology
?search=help
?sort=recent

Response:
{
  "success": true,
  "tasks": [
    { task1... },
    { task2... }
  ]
}
```

### GET /api/tasks/:taskId
Get task details

### PUT /api/tasks/:taskId
Update task (requires token - must be task creator)

### DELETE /api/tasks/:taskId
Delete task (requires token - must be task creator)

### GET /api/tasks/user/:userId
Get tasks posted by user

### GET /api/tasks/trending
Get trending tasks

---

## 📝 Application Endpoints

### POST /api/applications
Apply for a task (requires token)
```
Request:
{
  "taskId": "507f1f77bcf86cd799439011",
  "message": "I can do this task!"
}

Response:
{
  "success": true,
  "message": "Application submitted",
  "application": { ... }
}
```

### GET /api/applications/task/:taskId
Get all applications for a task

### GET /api/applications/user/:userId
Get all applications by a user

### PUT /api/applications/:appId/accept
Accept an application (requires token)

### PUT /api/applications/:appId/reject
Reject an application (requires token)

### PUT /api/applications/:appId/complete
Mark task as completed (requires token)

---

## 💬 Message Endpoints

### POST /api/messages
Send a message (requires token)
```
Request:
{
  "toUserId": "507f1f77bcf86cd799439011",
  "message": "Hello there!"
}
```

### GET /api/messages/conversations
Get all conversations (requires token)

### GET /api/messages/conversations/:toUserId
Get chat history with a user (requires token)

### PUT /api/messages/:messageId/seen
Mark message as seen (requires token)

### DELETE /api/messages/:messageId
Delete message (requires token)

---

## 📰 Post Endpoints

### POST /api/posts
Create a post (requires token)
```
Request:
{
  "content": "Just finished a great project!",
  "images": ["url1", "url2"]
}
```

### GET /api/posts
Get feed posts

### GET /api/posts/:postId
Get single post

### PUT /api/posts/:postId
Update post (requires token)

### DELETE /api/posts/:postId
Delete post (requires token)

### POST /api/posts/:postId/like
Like a post (requires token)

### POST /api/posts/:postId/unlike
Unlike a post (requires token)

### POST /api/posts/:postId/comment
Add comment to post (requires token)

### GET /api/posts/:postId/comments
Get post comments

---

## 🤝 Connection Endpoints

### POST /api/connections
Send connection request (requires token)

### GET /api/connections
Get pending connections (requires token)

### PUT /api/connections/:connId/accept
Accept connection (requires token)

### DELETE /api/connections/:connId
Reject/remove connection (requires token)

---

## ⭐ Review Endpoints

### POST /api/reviews
Create a review (requires token)
```
Request:
{
  "userId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Great work!",
  "taskId": "507f1f77bcf86cd799439012"
}
```

### GET /api/reviews/user/:userId
Get reviews for a user

### GET /api/reviews/task/:taskId
Get reviews for a task

---

## 🖼️ Upload Endpoints

### POST /api/upload/profile
Upload profile photo (requires token)
```
Multipart form with file
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "imageUrl": "https://ik.imagekit.io/9ywuh26sp/..."
}
```

### POST /api/upload/task
Upload task images (requires token)

### POST /api/upload/post
Upload post images (requires token)

---

## 🔍 Search Endpoints

### GET /api/search/trending
Get trending tasks

### GET /api/search
Search tasks
```
Query: ?q=keywords&category=Technology
```

---

## Headers Reference

### Authentication Header (Required for protected endpoints):
```
Authorization: Bearer <JWT_TOKEN>
```

### Content Type:
```
Content-Type: application/json
```

### For File Uploads:
```
Content-Type: multipart/form-data
```

---

## Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Token missing or invalid
- **403 Forbidden** - Don't have permission
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Base URL

```
http://localhost:5000/api
```

---

## Testing with cURL

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}'
```

### Create Task (with token):
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "taskCategory":"Technology",
    "taskDescription":"Need help...",
    "taskType":"One-time",
    "location":"New York",
    "paymentAmount":100,
    "fullName":"John Doe",
    "phoneNumber":"+1234567890"
  }'
```

---

## Frontend Integration Example

```javascript
// Login
const response = await authAPI.login({
  username: "johndoe",
  password: "password123"
});
localStorage.setItem('authToken', response.token);

// Create Task with auth
const response = await taskAPI.createTask({
  taskCategory: "Technology",
  taskDescription: "Help with website",
  // ... other fields
});

// Get Profile (authenticated)
const response = await userAPI.getProfile();
```
