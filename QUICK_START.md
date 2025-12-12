# 🚀 Quick Start Guide - Username/Password Authentication

## ⚡ 5-Minute Setup

### Step 1: Install bcryptjs (if not installed)
```bash
cd snufix-backend
npm install bcryptjs
```

### Step 2: Start Backend
```bash
cd snufix-backend
npm run dev
```
✅ Server should run on http://localhost:5000

### Step 3: Start Frontend
```bash
cd project
npm run dev
```
✅ App should run on http://localhost:5173

### Step 4: Test the Application

**Create Account:**
1. Go to http://localhost:5173/login
2. Click "Sign up"
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Full Name: `Test User`
   - Password: `test123456`
4. Click "Create Account"
5. ✅ Should redirect to /feeds

**Login:**
1. Click Logout
2. Enter:
   - Username: `testuser`
   - Password: `test123456`
3. ✅ Should redirect to /feeds

**Create Task:**
1. Click "Post Task" in navbar
2. Fill in task details
3. Click "Post Task"
4. ✅ Task should be created

---

## 📝 Key Changes Summary

| Aspect | Old (Clerk) | New (Custom) |
|--------|------------|------------|
| **Auth Method** | OAuth with Clerk | Username/Password with JWT |
| **Login** | Clerk Widget | Custom Form |
| **User ID** | `user.id` (string) | `user._id` (MongoDB ObjectId) |
| **Token** | Clerk Token | JWT Token in localStorage |
| **Password** | Managed by Clerk | Hashed with bcryptjs |
| **Registration** | Clerk Widget | Custom Form with validation |

---

## 🔐 Login Credentials Examples

```javascript
// Example test account
username: "testuser"
email: "test@example.com"
password: "test123456"
fullName: "Test User"

// Create your own:
username: "yourusername"
email: "your@email.com"
password: "yourpassword" (min 6 chars)
fullName: "Your Name"
```

---

## 📱 Frontend Features

### Login Page (`/login`)
- ✅ Toggle between Login and Signup
- ✅ Username field
- ✅ Password field with visibility toggle
- ✅ Email field (signup only)
- ✅ Full Name field (signup only)
- ✅ Form validation
- ✅ Error messages
- ✅ Success notifications

### Navbar
- ✅ Login button (when not authenticated)
- ✅ Logout button (when authenticated)
- ✅ Protected routes checking

### Protected Pages
- ✅ `/profile` - Requires login
- ✅ `/post-task` - Requires login
- ✅ `/accept-task` - Requires login
- ✅ `/feeds` - Requires login
- ✅ `/messages` - Requires login
- ✅ `/connections` - Requires login
- ✅ `/discover` - Requires login

---

## 🔧 Backend Endpoints

```
POST   /api/auth/signup     - Create account
POST   /api/auth/login      - Login user
GET    /api/auth/verify     - Verify token

GET    /api/users/profile   - Current user profile (protected)
GET    /api/users/:userId   - Any user profile
PUT    /api/users/:userId   - Update profile (protected)

POST   /api/tasks           - Create task (protected)
GET    /api/tasks           - Get all tasks
GET    /api/tasks/:taskId   - Get task details
```

---

## 💾 localStorage Structure

After login, two items are stored:

```javascript
// 1. Authentication Token
localStorage.getItem('authToken')
// → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// 2. User Data
localStorage.getItem('user')
// → {
//   "id": "507f1f77bcf86cd799439011",
//   "username": "testuser",
//   "email": "test@example.com",
//   "fullName": "Test User"
// }
```

---

## 🧪 Testing Checklist

- [ ] Can create new account
- [ ] Can login with credentials
- [ ] Cannot login with wrong password
- [ ] Cannot login with nonexistent username
- [ ] Can see profile after login
- [ ] Can post task after login
- [ ] Cannot access /profile without login
- [ ] Cannot access /post-task without login
- [ ] Logout clears localStorage
- [ ] After logout, cannot access protected pages
- [ ] Token is sent with API requests (check DevTools > Network > Headers)

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot POST /api/auth/login"
**Solution:** Make sure backend is running on port 5000
```bash
cd snufix-backend && npm run dev
```

### Issue: "Invalid credentials"
**Solution:** Check username and password are correct
- Username is case-sensitive
- Password must be exact match (case-sensitive)

### Issue: "User already exists"
**Solution:** Try a different username or email
```bash
# Or clear the database:
# In MongoDB: db.users.deleteMany({})
```

### Issue: "Cannot read property 'authToken' of null"
**Solution:** User is not logged in
- Go to /login page
- Create account or login
- Try again

### Issue: Token errors in API calls
**Solution:** Logout and login again to refresh token
```javascript
// In browser console:
localStorage.removeItem('authToken');
localStorage.removeItem('user');
```

---

## 📊 Database Setup

### MongoDB Connection
The app automatically connects to MongoDB when backend starts.

**Connection string:** From `.env` file
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

### First-Time Setup
- Create a new user via signup
- User is automatically added to `users` collection
- Password is automatically hashed with bcryptjs

---

## 🔐 Security Features

✅ **Passwords Hashed** - Using bcryptjs (10 salt rounds)
✅ **JWT Tokens** - Secure token-based auth
✅ **Token Expiry** - Tokens expire after 30 days
✅ **Protected Routes** - Backend validates token on requests
✅ **Password Validation** - Min 6 characters required
✅ **Username Uniqueness** - Each username is unique

---

## 📚 File Structure

```
Frontend Changes:
├── src/
│   ├── main.jsx                    ✅ Removed ClerkProvider
│   ├── App.jsx                     ✅ Use localStorage for auth
│   ├── pages/
│   │   ├── Login.jsx               ✅ NEW - Custom login form
│   │   ├── Profile.jsx             ✅ Updated - Use getProfile()
│   │   ├── PostTask.jsx            ✅ Updated - Get user from localStorage
│   │   └── ReviewApplications.jsx  ✅ Removed Clerk hook
│   ├── components/
│   │   └── Navbar.jsx              ✅ Updated - Logout button
│   └── services/
│       └── api.js                  ✅ Updated - New auth endpoints

Backend Changes:
├── controllers/
│   └── authController.js           ✅ login(), signup()
├── models/
│   └── User.js                     ✅ password field, bcrypt
├── routes/
│   ├── auth.js                     ✅ /signup, /login
│   └── users.js                    ✅ GET /profile
```

---

## 🎓 Next Steps

1. **Customize Validation**
   - Edit password requirements in Login.jsx
   - Edit username minimum length

2. **Add Email Verification**
   - Send verification email on signup
   - Require email verification before login

3. **Add Password Reset**
   - Create reset token
   - Send reset email
   - Update password endpoint

4. **Add 2FA (Two-Factor Authentication)**
   - Implement TOTP or SMS verification
   - Require 2FA on login

5. **Switch to httpOnly Cookies**
   - More secure than localStorage
   - Protects against XSS attacks

6. **Add OAuth Integration** (Optional)
   - Google login
   - GitHub login
   - Facebook login

---

## 📞 Support

For issues or questions:

1. Check the [AUTHENTICATION_MIGRATION.md](AUTHENTICATION_MIGRATION.md) file
2. Check the [API_ENDPOINTS_GUIDE.md](API_ENDPOINTS_GUIDE.md) file
3. Review backend logs: `npm run dev`
4. Check browser console (F12 > Console tab)
5. Check Network tab for API requests

---

## ✨ You're All Set!

The application is now fully configured with custom username/password authentication. All API routes are working, and the frontend is properly integrated.

**Happy coding! 🚀**
