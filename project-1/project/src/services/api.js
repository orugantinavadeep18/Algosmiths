// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API Calls
export const authAPI = {
  login: (data) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  signup: (data) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  verifyToken: () => apiCall('/auth/verify'),
  
  logout: () =>
    apiCall('/auth/logout', { method: 'POST' })
      .then(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      })
      .catch(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }),
  
  adminLogin: (data) =>
    apiCall('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

// User API Calls
export const userAPI = {
  getProfile: (userId) => {
    if (userId) {
      return apiCall(`/users/${userId}`);
    }
    // Get current logged-in user profile
    return apiCall(`/users/profile`);
  },
  
  updateProfile: (userId, data) =>
    apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  getUserStats: (userId) => apiCall(`/users/${userId}/stats`),
  
  followUser: (userId) =>
    apiCall(`/users/${userId}/follow`, { method: 'POST' }),
  
  unfollowUser: (userId) =>
    apiCall(`/users/${userId}/unfollow`, { method: 'POST' }),
  
  getFollowers: (userId) => apiCall(`/users/${userId}/followers`),
  
  getFollowing: (userId) => apiCall(`/users/${userId}/following`),
  
  // Location-based APIs
  getNearbyWorkers: (data) =>
    apiCall('/users/nearby/workers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  updateUserLocation: (data) =>
    apiCall('/users/location', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};

// Task API Calls
export const taskAPI = {
  createTask: (data) =>
    apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/tasks${query ? '?' + query : ''}`);
  },
  
  getTaskById: (taskId) => apiCall(`/tasks/${taskId}`),
  
  updateTask: (taskId, data) =>
    apiCall(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  deleteTask: (taskId) =>
    apiCall(`/tasks/${taskId}`, { method: 'DELETE' }),
  
  getUserTasks: (userId) => apiCall(`/tasks/user/${userId}`),
  
  getTrendingTasks: () => apiCall('/search/trending'),
  
  getMyPostedTasks: () => apiCall('/tasks/my-tasks'),
  
  getTaskApplications: (taskId) => apiCall(`/tasks/${taskId}/applications`),
  
  selectWorker: (taskId, workerId) =>
    apiCall(`/tasks/${taskId}/select-worker`, {
      method: 'POST',
      body: JSON.stringify({ workerId })
    }),
  
  updateTaskWorkStatus: (taskId, workStatus) =>
    apiCall(`/tasks/${taskId}/work-status`, {
      method: 'PUT',
      body: JSON.stringify({ workStatus })
    }),
  
  // Location-based APIs
  getNearbyTasks: (data) =>
    apiCall('/tasks/nearby', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

// Application API Calls
export const applicationAPI = {
  applyForTask: (taskId, data) =>
    apiCall('/applications', {
      method: 'POST',
      body: JSON.stringify({ taskId, ...data })
    }),
  
  getApplications: (taskId) => apiCall(`/applications/task/${taskId}`),
  
  getUserApplications: (userId) => apiCall(`/applications/user/${userId}`),
  
  getMyApplications: () => apiCall('/applications/my-applications'),
  
  acceptApplication: (appId) =>
    apiCall(`/applications/${appId}/accept`, { method: 'POST' }),
  
  rejectApplication: (appId) =>
    apiCall(`/applications/${appId}/reject`, { method: 'POST' }),
  
  completeApplication: (appId) =>
    apiCall(`/applications/${appId}/complete`, { method: 'POST' })
};

// Post API Calls
export const postAPI = {
  createPost: (data) =>
    apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getPosts: () => apiCall('/posts'),
  
  getPostById: (postId) => apiCall(`/posts/${postId}`),
  
  updatePost: (postId, data) =>
    apiCall(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  deletePost: (postId) =>
    apiCall(`/posts/${postId}`, { method: 'DELETE' }),
  
  likePost: (postId) =>
    apiCall(`/posts/${postId}/like`, { method: 'POST' }),
  
  unlikePost: (postId) =>
    apiCall(`/posts/${postId}/unlike`, { method: 'POST' }),
  
  addComment: (postId, data) =>
    apiCall(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

// Message API Calls
export const messageAPI = {
  sendMessage: (taskId, toUserId, text) =>
    apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify({ taskId, toUserId, text })
    }),
  
  getConversations: () => apiCall('/messages/conversations'),
  
  getTaskChat: (taskId) => apiCall(`/messages/task/${taskId}`),
  
  getChatHistory: (userId) => apiCall(`/messages/conversations/${userId}`),
  
  markAsSeen: (messageId) =>
    apiCall(`/messages/${messageId}/seen`, { method: 'PUT' })
};

// Task API additions
taskAPI.completeTask = (taskId) =>
  apiCall(`/tasks/${taskId}/complete`, { method: 'PUT' });

// Connection API Calls
export const connectionAPI = {
  sendRequest: (data) =>
    apiCall('/connections', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getConnections: (userId) => apiCall(`/connections/user/${userId}`),
  
  getPendingRequests: (userId) => apiCall(`/connections/pending/${userId}`),
  
  acceptConnection: (connId) =>
    apiCall(`/connections/${connId}/accept`, { method: 'PUT' }),
  
  rejectConnection: (connId) =>
    apiCall(`/connections/${connId}/reject`, { method: 'PUT' })
};

// Review API Calls
export const reviewAPI = {
  createReview: (data) =>
    apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  getUserReviews: (userId) => apiCall(`/reviews/user/${userId}`),
  
  getTaskReviews: (taskId) => apiCall(`/reviews/task/${taskId}`)
};

// Upload API Calls
export const uploadAPI = {
  uploadProfilePhoto: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(`${API_URL}/upload/profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    }).then(res => res.json());
  },
  
  uploadTaskImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    return fetch(`${API_URL}/upload/task`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    }).then(res => res.json());
  },
  
  uploadPostImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    return fetch(`${API_URL}/upload/post`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    }).then(res => res.json());
  }
};

// Search API Calls
export const searchAPI = {
  searchTasks: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/search/tasks${query ? '?' + query : ''}`);
  },
  
  searchUsers: (q) => apiCall(`/search/users?q=${q}`),
  
  discoverPage: () => apiCall('/search/discover'),
  
  getTrending: () => apiCall('/search/trending'),
  
  getRecommended: (userId) => apiCall(`/search/recommended/${userId}`)
};
// Admin API Calls
export const adminAPI = {
  getDashboard: () => apiCall('/admin/dashboard'),
  
  getAllUsers: () => apiCall('/admin/users'),
  
  getUserDetails: (userId) => apiCall(`/admin/users/${userId}`),
  
  toggleUserStatus: (userId, isActive) =>
    apiCall(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive })
    }),
  
  deleteUser: (userId) =>
    apiCall(`/admin/users/${userId}`, { method: 'DELETE' }),
  
  getActiveUsers: () => apiCall('/admin/active-users')
};