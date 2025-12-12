import React, { useState } from 'react';
import { Mail, Lock, Loader, AlertCircle, CheckCircle, Eye, EyeOff, User, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (!isLogin && !isAdmin) {
      if (!formData.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('Please enter a valid email');
        return false;
      }
      if (!formData.fullName.trim()) {
        setError('Full name is required');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isAdmin) {
        // Admin Login
        const response = await authAPI.adminLogin({
          username: formData.username,
          password: formData.password
        });

        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        setSuccess('Admin logged in successfully! Redirecting...');
        
        setTimeout(() => {
          navigate('/admin-dashboard');
          window.location.reload();
        }, 1500);
      } else if (isLogin) {
        // User Login
        const response = await authAPI.login({
          username: formData.username,
          password: formData.password
        });

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setSuccess('Logged in successfully! Redirecting...');
        
        setTimeout(() => {
          navigate('/feeds');
          window.location.reload();
        }, 1500);
      } else {
        // User Signup
        const response = await authAPI.signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName
        });

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setSuccess('Account created successfully! Redirecting...');
        
        setTimeout(() => {
          navigate('/feeds');
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4 py-12 mt-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 pb-4 border-b-2 border-gray-200">
              <button
                onClick={() => {
                  setIsAdmin(false);
                  setIsLogin(true);
                  setError('');
                  setSuccess('');
                }}
                className={`pb-3 px-1 font-bold text-lg transition-all duration-300 relative ${
                  isLogin && !isAdmin
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign In
                {isLogin && !isAdmin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>}
              </button>
              <button
                onClick={() => {
                  setIsAdmin(false);
                  setIsLogin(false);
                  setError('');
                  setSuccess('');
                }}
                className={`pb-3 px-1 font-bold text-lg transition-all duration-300 relative ${
                  !isLogin && !isAdmin
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign Up
                {!isLogin && !isAdmin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>}
              </button>
              <button
                onClick={() => {
                  setIsAdmin(true);
                  setIsLogin(true);
                  setError('');
                  setSuccess('');
                }}
                className={`pb-3 px-1 font-bold text-lg transition-all duration-300 relative flex items-center gap-1 ${
                  isAdmin
                    ? 'text-purple-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Shield size={18} />
                Admin
                {isAdmin && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>}
              </button>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {isAdmin ? '🔐 Admin Portal' : isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-gray-600 text-base">
                {isAdmin
                  ? 'Secure admin access'
                  : isLogin
                  ? 'Sign in to your account and start earning'
                  : 'Join our community and start your journey'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3 animate-in">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-800 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name - Signup only */}
              {!isLogin && !isAdmin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 pl-12 bg-blue-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                  {isAdmin ? 'Admin Username' : 'Username'}
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={isAdmin ? "Algosmiths" : "johndoe"}
                    className="w-full px-4 py-3 pl-12 bg-blue-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email - Signup only */}
              {!isLogin && !isAdmin && (
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 pl-12 bg-blue-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  {isAdmin ? 'Admin Password' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isAdmin ? "Alogosmiths123" : "••••••••"}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-blue-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password - Signup only */}
              {!isLogin && !isAdmin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                    className="w-full px-4 py-3 pl-12 pr-12 bg-blue-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Info Box - Admin tab only */}
              {isAdmin && (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <p className="text-sm text-purple-900 font-semibold">🔐 Admin Demo Credentials</p>
                  <p className="text-xs text-purple-700 mt-1">Username: <span className="font-mono font-bold">Algosmiths</span></p>
                  <p className="text-xs text-purple-700">Password: <span className="font-mono font-bold">Alogosmiths123</span></p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-8 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  isAdmin 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {isAdmin ? 'Admin Access...' : isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {isAdmin ? '🔐 Admin Portal' : isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            {!isAdmin && (
              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
            )}

            {/* Footer */}
            {!isAdmin && (
              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setSuccess('');
                      setFormData({
                        username: '',
                        email: '',
                        password: '',
                      confirmPassword: '',
                      fullName: ''
                    });
                  }}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
