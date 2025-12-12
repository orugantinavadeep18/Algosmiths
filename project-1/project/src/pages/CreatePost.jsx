import React, { useState } from 'react';
import { FileText, Plus, Loader, AlertCircle, CheckCircle, Type, Zap, Hash } from 'lucide-react';
import Navbar from '../components/Navbar';
import { postAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    hashtags: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      await postAPI.createPost({
        title: formData.title,
        content: formData.content,
        hashtags: formData.hashtags ? formData.hashtags.split(',').map(t => t.trim()).filter(t => t) : []
      });
      
      setSuccess('Post created successfully!');
      setTimeout(() => {
        navigate('/feeds');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create post');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fdfaf7' }} className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold bg-white/20 px-4 py-1 rounded-full">Share Your Thoughts</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Create a New Post</h1>
          <p className="text-blue-50 text-lg">Share your ideas, updates, and connect with the community</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-600" />
                Post Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What's on your mind?"
                maxLength="200"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-2">{formData.title.length} / 200 characters</p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Share your thoughts, stories, and experiences..."
                rows="10"
                maxLength="2000"
                className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-2">{formData.content.length} / 2000 characters</p>
            </div>

            {/* Hashtags */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-600" />
                Hashtags (comma-separated, optional)
              </label>
              <input
                type="text"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleInputChange}
                placeholder="e.g., #taskflow, #community, #hiring"
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-2">Add up to 5 hashtags to help people find your post</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/feeds')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  loading 
                    ? 'bg-gray-400' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Publish Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
