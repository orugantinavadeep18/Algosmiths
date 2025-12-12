import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Loader, AlertCircle, CheckCircle, Edit2, Briefcase, RefreshCw, Star, Award, TrendingUp, Zap, MessageCircle, Trophy } from 'lucide-react';
import Navbar from '../components/Navbar';
import MyPostedWorks from '../components/MyPostedWorks';
import ChatBox from './ChatBox';
import { userAPI, uploadAPI, reviewAPI, taskAPI, applicationAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Helper function to format location
const formatLocation = (locationData) => {
  if (!locationData) return 'Not provided';
  
  // If it's a string, return as is
  if (typeof locationData === 'string') return locationData;
  
  // If it's a GeoJSON object, handle it gracefully
  if (typeof locationData === 'object') {
    return 'Location set'; // Fallback for GeoJSON objects
  }
  
  return 'Not provided';
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPostedWorks, setShowPostedWorks] = useState(false);
  const [chatTaskId, setChatTaskId] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'done', 'applied'
  const [doneWorks, setDoneWorks] = useState([]);
  const [appliedWorks, setAppliedWorks] = useState([]);
  const [loadingDoneWorks, setLoadingDoneWorks] = useState(false);
  const [loadingAppliedWorks, setLoadingAppliedWorks] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profilePhoto: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, []);

  // Auto-refresh applied works when switching to that tab
  useEffect(() => {
    if (activeTab === 'applied') {
      fetchAppliedWorks();
    } else if (activeTab === 'done') {
      fetchDoneWorks();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfile(response.user);
      setFormData({
        firstName: response.user.fullName?.split(' ')[0] || '',
        lastName: response.user.fullName?.split(' ').slice(1).join(' ') || '',
        email: response.user.email || '',
        phone: response.user.phone || '',
        location: response.user.location || '',
        bio: response.user.bio || '',
        profilePhoto: response.user.profilePicture || ''
      });
      
      // Fetch reviews
      const reviewsResponse = await reviewAPI.getUserReviews(response.user._id);
      setReviews(reviewsResponse.reviews || []);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoneWorks = async () => {
    try {
      setLoadingDoneWorks(true);
      const response = await taskAPI.getMyPostedTasks();
      // Filter for completed tasks
      const completed = response.tasks.filter(task => task.status === 'completed');
      setDoneWorks(completed);
    } catch (err) {
      console.error('Error fetching done works:', err);
      setError('Failed to load completed works');
    } finally {
      setLoadingDoneWorks(false);
    }
  };

  const fetchAppliedWorks = async () => {
    try {
      setLoadingAppliedWorks(true);
      const response = await applicationAPI.getMyApplications();
      setAppliedWorks(response.applications || []);
    } catch (err) {
      console.error('Error fetching applied works:', err);
      setError('Failed to load applied works');
    } finally {
      setLoadingAppliedWorks(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPhoto(true);
      const response = await uploadAPI.uploadProfilePhoto(file);
      setFormData(prev => ({
        ...prev,
        profilePhoto: response.imageUrl
      }));
      setSuccess('Photo uploaded successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to upload photo');
      console.error('Error uploading photo:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await userAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        profilePhoto: formData.profilePhoto
      });
      setSuccess('Profile updated successfully');
      setEditing(false);
      fetchProfile();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save profile');
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <Loader className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  }

  const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/9ywuh26sp';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Profile</h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg">Manage your profile and work history</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 border border-gray-100">
          {/* Cover Image */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 to-purple-600"></div>

          {/* Profile Content */}
          <div className="px-4 sm:px-8 py-6 sm:py-8 relative">
            {/* Profile Photo and Info */}
            <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-6 md:gap-8 mb-8 w-full">
              <div className="relative -mt-16 sm:-mt-24">
                {formData.profilePhoto ? (
                  <img
                    src={formData.profilePhoto}
                    alt="Profile"
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white shadow-2xl object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white shadow-2xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                    {formData.firstName?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                {editing && (
                  <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-all shadow-lg">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                    <Edit2 className="w-5 h-5" />
                  </label>
                )}
              </div>

              <div className="flex-1 pt-2 w-full text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {formData.firstName} {formData.lastName}
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-4">@{profile?.username || 'user'}</p>
                
                {!editing && profile && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6 w-full">
                    <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100">
                      <div className="flex flex-col items-center gap-1 mb-2">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <p className="text-xl sm:text-2xl font-bold text-blue-600">{profile.completedTasks || 0}</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 text-center">Completed</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-100">
                      <div className="flex flex-col items-center gap-1 mb-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 fill-current" />
                        <p className="text-xl sm:text-2xl font-bold text-yellow-600">{(profile.rating || 5).toFixed(1)}</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 text-center">Rating</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100">
                      <div className="flex flex-col items-center gap-1 mb-2">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <p className="text-xl sm:text-2xl font-bold text-purple-600">{profile.followers || 0}</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 text-center">Followers</p>
                    </div>
                  </div>
                )}
              </div>

              {!editing && (
                <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowPostedWorks(true)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                  >
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">My Works</span>
                    <span className="sm:hidden">Works</span>
                  </button>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                  >
                    <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        {!chatTaskId && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg mb-8 sticky top-20 sm:top-24 z-10 border border-gray-100 overflow-x-auto">
            <div className="flex border-b-2 border-gray-200 min-w-max sm:min-w-full">
              <button
                onClick={() => { setActiveTab('profile'); }}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-semibold transition-all text-center whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Profile</span>
                </div>
              </button>
              <button
                onClick={() => { setActiveTab('done'); fetchDoneWorks(); }}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-semibold transition-all text-center whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'done'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Completed</span>
                </div>
              </button>
              <button
                onClick={() => { setActiveTab('applied'); fetchAppliedWorks(); }}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-semibold transition-all text-center whitespace-nowrap text-sm sm:text-base ${
                  activeTab === 'applied'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-0.5'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Applied</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Chat View */}
        {chatTaskId && (
          <ChatBox 
            taskId={chatTaskId} 
            onBack={() => setChatTaskId(null)} 
          />
        )}

        {/* Profile Tab Content */}
        {!chatTaskId && activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <User className="w-8 h-8 text-blue-600" />
              {editing ? 'Edit Your Profile' : 'Profile Information'}
            </h2>

            {editing ? (
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-2">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself, your skills, and experience..."
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">{formData.bio.length} / 500 characters</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        firstName: profile?.firstName || '',
                        lastName: profile?.lastName || '',
                        email: profile?.email || '',
                        phone: profile?.phone || '',
                        location: profile?.location || '',
                        bio: profile?.bio || '',
                        profilePhoto: profile?.profilePhoto || ''
                      });
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      saving ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {saving ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Email</p>
                    <p className="text-xl font-semibold text-gray-900">{formData.email}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Phone</p>
                    <p className="text-xl font-semibold text-gray-900">{formData.phone || 'Not provided'}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Location</p>
                    <p className="text-xl font-semibold text-gray-900">{formatLocation(formData.location)}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Bio</p>
                  <p className="text-gray-900">{formData.bio || 'No bio added yet'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews Section */}
        {activeTab === 'profile' && !editing && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
            Reviews & Feedback
          </h2>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-300 transition bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{review.reviewer?.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-yellow-500 text-xl">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No reviews yet. Complete tasks to earn reviews!</p>
            </div>
          )}
        </div>
        )}

        {/* Done Works Tab */}
        {activeTab === 'done' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              Completed Works
            </h2>
            
            {loadingDoneWorks ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : doneWorks.length > 0 ? (
              <div className="space-y-4">
                {doneWorks.map(task => (
                  <div key={task._id} className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-lg transition bg-gradient-to-r from-green-50 to-transparent">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{task.taskDescription?.substring(0, 50)}...</h3>
                        <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {task.taskCategory}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-green-600 font-semibold text-lg">
                        <CheckCircle className="w-6 h-6" />
                        Completed
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm bg-white rounded-lg p-4">
                      <div>
                        <p className="text-gray-600 font-semibold">Location</p>
                        <p className="font-semibold text-gray-900">{formatLocation(task.location)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Payment</p>
                        <p className="font-semibold text-blue-600 text-lg">${task.paymentAmount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Completed</p>
                        <p className="font-semibold text-gray-900">{new Date(task.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No completed works yet. Keep working to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Applied Works Tab */}
        {activeTab === 'applied' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-blue-600" />
                Applied Works
              </h2>
              <button
                onClick={() => fetchAppliedWorks()}
                disabled={loadingAppliedWorks}
                className="p-3 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                title="Refresh applied works"
              >
                <RefreshCw className={`w-6 h-6 text-blue-600 ${loadingAppliedWorks ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {loadingAppliedWorks ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : appliedWorks.length > 0 ? (
              <div className="space-y-4">
                {appliedWorks.map(app => (
                  <div key={app._id} className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{app.taskId?.taskDescription?.substring(0, 50)}...</h3>
                        <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {app.taskId?.taskCategory}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        app.status === 'accepted' ? 'bg-green-100 text-green-700 border border-green-300' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-300' :
                        'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      }`}>
                        {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 rounded-lg p-4 mb-4">
                      <div>
                        <p className="text-gray-600 font-semibold">Location</p>
                        <p className="font-semibold text-gray-900">{formatLocation(app.taskId?.location)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Payment</p>
                        <p className="font-semibold text-blue-600 text-lg">${app.taskId?.paymentAmount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Applied On</p>
                        <p className="font-semibold text-gray-900">{new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {app.status === 'accepted' && app.taskId?.status !== 'completed' && (
                      <button
                        onClick={() => setChatTaskId(app.taskId._id)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 font-semibold"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Open Chat
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No applications yet. Start applying to tasks!</p>
              </div>
            )}
          </div>
        )}

        {/* My Posted Works Modal */}
        <MyPostedWorks 
          isOpen={showPostedWorks} 
          onClose={() => setShowPostedWorks(false)}
          onChatClick={(taskId) => {
            setChatTaskId(taskId);
            setShowPostedWorks(false);
          }}
        />
      </div>
    </div>
  );
}
