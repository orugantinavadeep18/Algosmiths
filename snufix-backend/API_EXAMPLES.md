# API USAGE EXAMPLES

## Base URL
```
http://localhost:5000/api
```

## Authentication Examples

### 1. Signup New User
```bash
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "fullName": "John Doe",
  "clerkId": "clerk_user_id"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_mongodb_id",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

### 2. Sync Clerk User
```bash
POST /auth/sync-clerk
Content-Type: application/json

{
  "clerkId": "user_2zdFoZib5lNr614LgkONdD8WG32",
  "email": "john@example.com",
  "fullName": "John Warren",
  "profilePicture": "https://..."
}
```

### 3. Verify Token
```bash
GET /auth/verify
Authorization: Bearer <your_jwt_token>

Response:
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "email@example.com",
    "fullName": "Full Name"
  }
}
```

---

## User Management Examples

### 1. Get User Profile
```bash
GET /users/user_id
```

### 2. Update Profile
```bash
PUT /users/user_id
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Updated Name",
  "bio": "I am a skilled worker",
  "location": "New York",
  "skills": ["Delivery", "Cleaning", "Tech Help"]
}
```

### 3. Follow User
```bash
POST /users/target_user_id/follow
Authorization: Bearer <token>
```

### 4. Get User Stats
```bash
GET /users/user_id/stats

Response:
{
  "success": true,
  "stats": {
    "rating": 4.8,
    "totalReviews": 42,
    "completedTasks": 58,
    "completionRate": 95,
    "level": 8,
    "xp": 3450,
    "followers": 125,
    "following": 89
  }
}
```

---

## Task Management Examples

### 1. Create Task
```bash
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskCategory": "Delivery & Pickup",
  "taskType": "delivery",
  "taskDescription": "Need delivery of groceries from store to home",
  "location": "New York, NY",
  "paymentAmount": 500,
  "fullName": "John Doe",
  "phoneNumber": "9876543210",
  "additionalNotes": "Must be careful with fragile items",
  "images": []
}

Response:
{
  "success": true,
  "message": "Task created",
  "task": {
    "_id": "task_id",
    "postedBy": "user_id",
    "status": "active",
    "createdAt": "2025-12-11T..."
  }
}
```

### 2. Get All Tasks
```bash
GET /tasks?category=Delivery&sort=recent&search=grocery

Query Parameters:
- category: Task category
- sort: 'recent' or 'popular'
- search: Search term
```

### 3. Get Task Details
```bash
GET /tasks/task_id

Response includes:
- Task details
- Posted by user info
- All applications
- View count
```

### 4. Update Task
```bash
PUT /tasks/task_id
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskDescription": "Updated description",
  "paymentAmount": 600
}
```

### 5. Delete Task
```bash
DELETE /tasks/task_id
Authorization: Bearer <token>
```

---

## Task Application Examples

### 1. Apply for Task
```bash
POST /applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task_id",
  "message": "I have 5 years experience in delivery. I can do this task!"
}

Response:
{
  "success": true,
  "message": "Application submitted",
  "application": {
    "_id": "app_id",
    "taskId": "task_id",
    "applicantId": "user_id",
    "status": "pending",
    "appliedAt": "2025-12-11T..."
  }
}
```

### 2. Get Task Applications
```bash
GET /applications/task/task_id

Returns all applications for a task with applicant details
```

### 3. Accept Application
```bash
POST /applications/app_id/accept
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Application accepted",
  "application": {
    "status": "accepted",
    "acceptedAt": "2025-12-11T..."
  }
}
```

### 4. Reject Application
```bash
POST /applications/app_id/reject
Authorization: Bearer <token>
```

### 5. Complete Task
```bash
POST /applications/app_id/complete
Authorization: Bearer <token>

Updates:
- Application status to 'completed'
- Task status to 'completed'
- User's completed tasks count
- User's completion rate
```

---

## Posts & Stories Examples

### 1. Create Post
```bash
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Just completed a delivery task! Great experience.",
  "imageUrls": ["https://ik.imagekit.io/..."],
  "postType": "text_with_image",
  "relatedTask": "task_id",
  "backgroundColor": "#4f46e5"
}
```

### 2. Get Feed
```bash
GET /posts

Returns latest 20 posts with user info and engagement metrics
```

### 3. Like Post
```bash
POST /posts/post_id/like
Authorization: Bearer <token>
```

### 4. Add Comment
```bash
POST /posts/post_id/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great work! 👏"
}
```

### 5. Delete Post
```bash
DELETE /posts/post_id
Authorization: Bearer <token>
```

---

## Messaging Examples

### 1. Send Message
```bash
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "toUserId": "recipient_user_id",
  "text": "Hi, are you available for the task?",
  "messageType": "text"
}
```

### 2. Get Conversations
```bash
GET /messages/conversations
Authorization: Bearer <token>

Returns all conversations sorted by latest message
```

### 3. Get Chat History
```bash
GET /messages/conversations/other_user_id
Authorization: Bearer <token>

Returns all messages between two users
```

### 4. Mark Message as Seen
```bash
PUT /messages/message_id/seen
Authorization: Bearer <token>
```

---

## Connection Examples

### 1. Send Connection Request
```bash
POST /connections
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "target_user_id"
}
```

### 2. Get User Connections
```bash
GET /connections/user/user_id

Returns all accepted connections
```

### 3. Accept Connection
```bash
PUT /connections/conn_id/accept
Authorization: Bearer <token>
```

### 4. Reject Connection
```bash
PUT /connections/conn_id/reject
Authorization: Bearer <token>
```

---

## Review Examples

### 1. Create Review
```bash
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "revieweeId": "worker_user_id",
  "taskId": "task_id",
  "rating": 5,
  "reviewText": "Excellent work! Very professional.",
  "category": "quality"
}

Updates:
- Reviewee's rating (average)
- Reviewee's total reviews count
- User level and XP
```

### 2. Get User Reviews
```bash
GET /reviews/user/user_id

Returns all reviews for a user
```

---

## Upload Examples

### 1. Upload Profile Photo
```bash
POST /upload/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: <binary_image_file>

Response:
{
  "success": true,
  "message": "Profile photo uploaded",
  "url": "https://ik.imagekit.io/9ywuh26sp/snufix/profiles/..."
}
```

### 2. Upload Task Images
```bash
POST /upload/task
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- files: <multiple_image_files> (max 5)

Response:
{
  "success": true,
  "message": "Images uploaded",
  "urls": [
    "https://ik.imagekit.io/...",
    "https://ik.imagekit.io/..."
  ]
}
```

### 3. Upload Post Images
```bash
POST /upload/post
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- files: <multiple_image_files>
```

---

## Search Examples

### 1. Search Tasks
```bash
GET /search/tasks?q=delivery&category=Delivery&minPrice=100&maxPrice=1000&location=NYC
```

### 2. Search Users
```bash
GET /search/users?q=john

Returns users matching search term
```

### 3. Discover Page
```bash
GET /search/discover

Returns:
- Trending tasks
- Top rated users
- Recent tasks
```

### 4. Get Trending
```bash
GET /search/trending

Returns top 15 most viewed tasks
```

### 5. Get Recommended
```bash
GET /search/recommended/user_id
Authorization: Bearer <token>

Returns recommended tasks based on user skills
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "error": { }
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

---

## Using with Frontend

### 1. Store JWT Token
```javascript
const token = response.data.token;
localStorage.setItem('authToken', token);
```

### 2. Include in Requests
```javascript
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
};
```

### 3. Image Upload to ImageKit
```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('http://localhost:5000/api/upload/profile', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log(data.url); // ImageKit URL
```

---

## Testing with Postman

1. Create environment variables
   - `baseUrl`: http://localhost:5000/api
   - `token`: (your JWT token)

2. Use variables in requests
   - URL: `{{baseUrl}}/users/user_id`
   - Authorization: `Bearer {{token}}`

3. Save responses for later use
   - Postman automatically stores response values
   - Use them in subsequent requests

---

Happy Testing! 🚀
