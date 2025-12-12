# 🚀 INSTALLATION & RUN GUIDE

## ⚡ QUICK START (2 MINUTES)

### 1. Navigate to Project
```bash
cd c:\Users\Sridevinivas\Downloads\snufix-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Server
```bash
npm run dev
```

### 4. You Should See
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
```

### 5. Test API
```bash
curl http://localhost:5000/api/health
```

---

## 📦 WHAT'S INSTALLED

### Core Dependencies
- **express** (4.18.2) - Web framework
- **mongoose** (8.0.0) - MongoDB ODM
- **dotenv** (16.3.1) - Environment variables
- **cors** (2.8.5) - Cross-origin requests
- **jsonwebtoken** (9.1.0) - JWT tokens
- **bcryptjs** (2.4.3) - Password hashing
- **imagekit** (4.1.3) - Image uploads
- **multer** (1.4.5) - File uploads
- **express-validator** (7.0.0) - Input validation
- **nodemon** (3.0.1) - Dev auto-reload

---

## 📁 COMPLETE FILE STRUCTURE

```
snufix-backend/
│
├── 📄 server.js                    ← Main entry point
├── 📄 package.json                 ← Dependencies
├── 📄 .env                         ← Configured ✅
├── 📄 .gitignore                   ← Git rules
│
├── 📄 README.md                    ← Project docs
├── 📄 SETUP_COMPLETE.md            ← Setup details
├── 📄 COMPLETE_SUMMARY.md          ← Full summary
├── 📄 API_EXAMPLES.md              ← Usage examples
├── 📄 INSTALLATION.md              ← This file
│
├── 📁 config/                      ← Ready for configs
│
├── 📁 middleware/                  ← 4 files
│   ├── auth.js                     ← JWT verification
│   ├── errorHandler.js             ← Error handling
│   ├── logger.js                   ← Request logging
│   └── upload.js                   ← Multer setup
│
├── 📁 models/                      ← 7 schemas
│   ├── User.js
│   ├── Task.js
│   ├── Application.js
│   ├── Post.js
│   ├── Message.js
│   ├── Connection.js
│   └── Review.js
│
├── 📁 controllers/                 ← 10 files
│   ├── authController.js           ← Auth logic
│   ├── userController.js           ← User management
│   ├── taskController.js           ← Task CRUD
│   ├── applicationController.js    ← Applications
│   ├── postController.js           ← Posts & stories
│   ├── messageController.js        ← Messaging
│   ├── connectionController.js     ← Connections
│   ├── reviewController.js         ← Reviews
│   ├── uploadController.js         ← ImageKit uploads
│   └── searchController.js         ← Search logic
│
├── 📁 routes/                      ← 10 files
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
│
├── 📁 utils/                       ← Helper functions
│   └── tokens.js                   ← JWT utilities
│
└── 📁 constants/                   ← Constants
    ├── categories.js               ← Task categories
    ├── badges.js                   ← User badges
    └── responses.js                ← API responses
```

---

## ✅ CONFIGURATION STATUS

### Environment Variables (.env)
```
✅ PORT=5000
✅ MONGODB_URI=configured (with credentials)
✅ IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/9ywuh26sp
✅ FRONTEND_URL=http://localhost:5173
✅ JWT_SECRET=set
```

### Database
```
✅ MongoDB Atlas Connection - READY
   Username: nagireddiyashaswini_db_user
   Password: Algosmiths123
   Cluster: cluster0.ksmoit7.mongodb.net
   Database: snufix-db
```

### Image Upload
```
✅ ImageKit Configured - READY
   URL: https://ik.imagekit.io/9ywuh26sp
   Folders: /snufix/profiles, /snufix/tasks, /snufix/posts, /snufix/messages
```

### Authentication
```
✅ JWT Setup - READY
   Expiry: 7 days
   Algorithm: HS256
   Clerk Integration: Ready
```

---

## 🎯 SCRIPTS AVAILABLE

```bash
npm run dev    # Start with nodemon (auto-reload on changes)
npm start      # Start normally
npm test       # Run tests (placeholder)
```

---

## 🧪 TESTING THE SERVER

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

Expected Response:
```json
{
  "status": "Server is running",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

### Test 2: Create User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test User",
    "clerkId": "clerk_test_123"
  }'
```

### Test 3: Get Token
```bash
# Store the token from signup response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Use it to verify
curl http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 TROUBLESHOOTING

### Issue: MongoDB Connection Failed
```
❌ Error: MongoServerError
Solution: 
1. Check internet connection
2. Verify credentials in .env
3. Check MongoDB Atlas IP whitelist
4. Ensure database exists
```

### Issue: Port 5000 Already in Use
```
❌ Error: EADDRINUSE: address already in use
Solution:
1. Change PORT in .env to 5001
2. Or kill process: lsof -i :5000
```

### Issue: ImageKit Upload Failed
```
❌ Error: ImageKit authentication failed
Solution:
1. Verify imagekit-id: 9ywuh26sp
2. Check folder permissions
3. Verify file size < 50MB
```

### Issue: JWT Token Invalid
```
❌ Error: JsonWebTokenError
Solution:
1. Ensure token not expired
2. Verify JWT_SECRET matches
3. Check Authorization header format
```

---

## 📊 PERFORMANCE TIPS

### Development
- Use `npm run dev` for auto-reload
- Check browser DevTools Network tab
- Use Postman for API testing

### Production
- Set `NODE_ENV=production`
- Enable compression middleware
- Add rate limiting
- Use MongoDB indexing
- Set up caching

---

## 🔐 SECURITY CHECKLIST

Before production deployment:
- [ ] Change JWT_SECRET to random 32+ character string
- [ ] Add CORS whitelist
- [ ] Enable HTTPS/SSL
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Sanitize database queries
- [ ] Set secure HTTP headers
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Set up error tracking

---

## 📱 CONNECTING FRONTEND

### 1. Set API URL in Frontend .env
```
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Backend in Frontend (if needed)
```javascript
// package.json
"proxy": "http://localhost:5000"
```

### 3. Make API Calls
```javascript
const response = await fetch('http://localhost:5000/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🎓 NEXT STEPS

1. **Familiarize with Code**
   - Read API_EXAMPLES.md
   - Check controller logic
   - Review model schemas

2. **Test Endpoints**
   - Use Postman
   - Import all endpoints
   - Test with sample data

3. **Connect Frontend**
   - Update API calls
   - Test authentication
   - Verify data flow

4. **Add Features** (Optional)
   - WebSockets for real-time
   - Notifications system
   - Payment integration
   - Email verification

5. **Deploy**
   - Choose hosting (Heroku, Railway, Render)
   - Set environment variables
   - Deploy MongoDB backup
   - Monitor performance

---

## 📞 SUPPORT

If you encounter issues:

1. **Check Logs**
   ```
   Look at console output for errors
   ```

2. **Read Documentation**
   ```
   - README.md
   - API_EXAMPLES.md
   - COMPLETE_SUMMARY.md
   ```

3. **Test Endpoints**
   ```
   Use Postman or Curl
   Follow examples in API_EXAMPLES.md
   ```

4. **Check Configuration**
   ```
   Verify .env file
   Test MongoDB connection
   Check ImageKit settings
   ```

---

## ✨ YOU'RE ALL SET!

Everything is configured and ready to run.

```bash
# Just run:
npm install
npm run dev

# Server starts on port 5000
# MongoDB connected ✅
# ImageKit ready ✅
# JWT auth ready ✅
```

**Enjoy building Snufix! 🚀**

---

## 📚 FILE REFERENCE

| File | Purpose |
|------|---------|
| server.js | Main application entry |
| package.json | Dependencies list |
| .env | Environment configuration |
| README.md | Project overview |
| SETUP_COMPLETE.md | Detailed setup |
| COMPLETE_SUMMARY.md | Full feature summary |
| API_EXAMPLES.md | API usage examples |
| INSTALLATION.md | This file |

---

**Last Updated:** December 11, 2025
**Status:** ✅ READY TO USE
**Version:** 1.0.0
