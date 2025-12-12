# Authentication Migration: Clerk → Username/Password

## Overview
Successfully migrated from Clerk authentication to custom username/password authentication with JWT tokens.

---

## 📋 Backend Changes

### 1. **User Model** (`snufix-backend/models/User.js`)
- ✅ Removed `clerkId` field (no longer needed)
- ✅ Added `password` field (required, min 6 chars)
- ✅ Made `username` field required and unique
- ✅ Added password hashing with bcryptjs
- ✅ Added `comparePassword()` method for login verification

### 2. **Auth Controller** (`snufix-backend/controllers/authController.js`)
**Removed:**
- `syncClerkUser()` function

**Added:**
- `login(username, password)` - Authenticates user and returns JWT token
- `signup(username, email, password, fullName)` - Registers new user

**Updated:**
- `generateToken()` - Creates JWT with user._id
- `verifyToken()` - Returns current logged-in user data

### 3. **Auth Routes** (`snufix-backend/routes/auth.js`)
```javascript
POST   /api/auth/signup    - Register new user
POST   /api/auth/login     - Login with credentials
GET    /api/auth/verify    - Verify JWT token
```

### 4. **User Controller** (`snufix-backend/controllers/userController.js`)
**Added:**
- `getCurrentProfile()` - Get logged-in user's profile (requires token)

**Updated:**
- `getProfile()` - Now searches by username first, then MongoDB ID
- `getUserStats()` - Now searches by username instead of clerkId

### 5. **User Routes** (`snufix-backend/routes/users.js`)
```javascript
GET    /api/users/profile         - Get current user profile (protected)
GET    /api/users/:userId         - Get any user profile (by username or ID)
```

---

## 📱 Frontend Changes

### 1. **main.jsx** 
- ✅ Removed `ClerkProvider` wrapper
- ✅ Removed Clerk initialization code
- ✅ Simplified to just BrowserRouter

### 2. **App.jsx**
- ✅ Removed `useUser()` hook
- ✅ Added localStorage check for authentication
- ✅ Added `isAuthenticated` state based on token
- ✅ Replaced Clerk user check with localStorage token check

### 3. **Login.jsx** (Completely Rewritten)
- ✅ Removed Clerk `SignIn` component
- ✅ Created custom login/signup form
- ✅ Form fields:
  - Username (3+ characters)
  - Email (signup only)
  - Full Name (signup only)
  - Password (6+ characters)
  - Confirm Password (signup only)
- ✅ Password visibility toggle
- ✅ Form validation
- ✅ Error/success messages
- ✅ Toggle between login and signup modes
- ✅ Stores token and user data in localStorage on success

### 4. **Profile.jsx**
- ✅ Removed `useUser()` hook
- ✅ Added navigation guard (redirects to login if not authenticated)
- ✅ Changed `getProfile()` to not require userId parameter
- ✅ Reads user data from token (authenticated request)

### 5. **PostTask.jsx**
- ✅ Removed `useUser()` hook
- ✅ Added localStorage check for authentication
- ✅ Gets user data from localStorage instead of Clerk
- ✅ Updated user name and phone references

### 6. **Navbar.jsx** (Completely Rewritten)
- ✅ Removed Clerk components (SignInButton, UserButton)
- ✅ Added localStorage auth check
- ✅ Added logout button with logout functionality
- ✅ Login button navigates to /login route
- ✅ Logout clears localStorage and reloads page

### 7. **ReviewApplications.jsx**
- ✅ Removed `useUser()` import and usage

### 8. **api.js** (services/api.js)
**Updated Auth API:**
```javascript
login: (data) → POST /api/auth/login
signup: (data) → POST /api/auth/signup
logout: () → Clear localStorage
verifyToken: () → GET /api/auth/verify
```

**Updated User API:**
```javascript
getProfile: (userId?) → GET /api/users/profile (if no userId)
                     → GET /api/users/:userId (if userId provided)
```

---

## 🔐 Authentication Flow

### Login Flow:
1. User enters username and password in Login form
2. Frontend calls `POST /api/auth/login` with credentials
3. Backend verifies credentials with bcrypt
4. Backend returns JWT token and user data
5. Frontend stores token in `localStorage.authToken`
6. Frontend stores user data in `localStorage.user`
7. Redirect to `/feeds`

### Signup Flow:
1. User enters username, email, password, fullName
2. Frontend validates form inputs
3. Frontend calls `POST /api/auth/signup` with data
4. Backend hashes password with bcryptjs
5. Backend creates new user in MongoDB
6. Backend returns JWT token
7. Frontend stores token and redirects

### Protected Routes:
1. Frontend checks `localStorage.authToken` in useEffect
2. If no token, redirect to `/login`
3. All API calls include token in `Authorization: Bearer <token>` header
4. Backend `verifyToken` middleware extracts and validates token

### Logout:
1. User clicks logout button
2. Frontend clears localStorage (authToken, user)
3. Frontend redirects to home
4. Page refreshes to clear state

---

## 🔄 User ID References

**Old (Clerk):** `user.id` (from Clerk user object)
**New (Custom):** 
- `user._id` (MongoDB ObjectId, from JWT or API response)
- `user.username` (String, for user lookup)

**Token Payload:**
```javascript
{
  id: user._id,  // MongoDB ObjectId
  iat: timestamp,
  exp: timestamp
}
```

---

## 📊 Database Changes

### Users Collection - New Schema:
```javascript
{
  username: String (required, unique, lowercase),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  fullName: String,
  phone: String,
  bio: String,
  profilePicture: String,
  // ... other fields remain the same
}
```

### Removed Fields:
- `clerkId` - No longer needed

---

## ✅ Working Features

- ✅ User Signup with validation
- ✅ User Login with credentials
- ✅ Password hashing with bcryptjs
- ✅ JWT token generation and verification
- ✅ Protected routes requiring authentication
- ✅ Logout functionality
- ✅ Profile fetching for logged-in user
- ✅ Task creation (requires authentication)
- ✅ All API calls include auth header
- ✅ Form validation and error messages
- ✅ Redirect to login for unauthenticated users

---

## 🚀 How to Test

### 1. **Start Backend:**
```bash
cd snufix-backend
npm run dev
# Server runs on http://localhost:5000
```

### 2. **Start Frontend:**
```bash
cd project
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. **Test Signup:**
- Go to http://localhost:5173/login
- Click "Sign up"
- Fill in form:
  - Username: `testuser`
  - Email: `test@example.com`
  - Full Name: `Test User`
  - Password: `password123`
  - Confirm: `password123`
- Click "Create Account"
- Should be redirected to /feeds

### 4. **Test Login:**
- Click logout
- Go to /login (or click Login in navbar)
- Enter username: `testuser`
- Enter password: `password123`
- Should be redirected to /feeds

### 5. **Test Protected Routes:**
- Try accessing /profile without logging in
- Should be redirected to home
- Login and access /profile
- Should see user profile

### 6. **Test API Calls:**
- Open browser DevTools (F12)
- Go to Network tab
- Login
- Create a task
- Check that requests have `Authorization: Bearer <token>` header

---

## 🐛 Troubleshooting

### "Invalid credentials" error:
- Check username is correct
- Check password is correct
- Verify user exists in database with `db.users.findOne({username: "..."})` 

### "No token provided" error:
- Ensure user is logged in
- Check localStorage for `authToken`
- Try logging in again

### Cannot access protected routes:
- Check if token is stored in localStorage
- Try clearing localStorage and logging in again
- Check browser console for auth errors

### Database errors about fields:
- Ensure MongoDB is running
- Clear old data: `db.users.deleteMany({})`
- Create new test user

---

## 📝 Notes

1. **Passwords are hashed** - Never stored as plain text
2. **JWT tokens expire** - Default 30 days (configurable in .env)
3. **Token in header** - Sent as `Authorization: Bearer <token>`
4. **localStorage is used** - Not the most secure for production, consider httpOnly cookies
5. **HTTPS required** - For production use HTTPS only

---

## ✨ Success Indicators

You'll know it's working when:
1. ✅ Can create account with username/password
2. ✅ Can login with credentials
3. ✅ Token is stored in localStorage after login
4. ✅ Can access profile page when logged in
5. ✅ Can create tasks when logged in
6. ✅ Cannot access protected pages when logged out
7. ✅ Logout clears token and redirects
8. ✅ All API calls include auth header

---

## 🎉 Migration Complete!

The application has been successfully migrated from Clerk to custom authentication with username/password login. All API routes are working and the frontend is fully integrated with the new authentication system.
