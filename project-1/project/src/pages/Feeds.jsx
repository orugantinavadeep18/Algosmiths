import React, { useState, useEffect } from 'react';
import { Heart, ThumbsUp, Laugh, MessageCircle, Share2, X, Image, Briefcase, TrendingUp, Users, Zap, Trophy, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { postAPI } from '../services/api';

const Feeds = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});
  const [user, setUser] = useState(null);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getPosts();
      setPosts(response.posts || []);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const userId = currentUser?.id || currentUser?._id;
      const post = posts.find(p => p._id === postId);
      const isLiked = post?.likes?.includes(userId);
      
      if (isLiked) {
        await postAPI.unlikePost(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: false }));
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, likes: post.likes.filter(id => id !== userId) } : post
        ));
      } else {
        await postAPI.likePost(postId);
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        setPosts(posts.map(post => 
          post._id === postId ? { ...post, likes: [...(post.likes || []), userId] } : post
        ));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentInput[postId]?.trim()) return;
    
    try {
      await postAPI.addComment(postId, { text: commentInput[postId] });
      setCommentInput(prev => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleCreatePost = async () => {
    if (!postText.trim()) return;
    
    try {
      await postAPI.createPost({
        content: postText,
        relatedTask: selectedTask || null,
        postType: 'text'
      });
      setPostText('');
      setSelectedTask('');
      setShowPostModal(false);
      fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post');
    }
  };

  const PostCard = ({ post }) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userId = currentUser?.id || currentUser?._id;
    const isLiked = post?.likes?.includes(userId);
    
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-all duration-200 group">
        {/* User Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg md:text-xl ring-2 ring-blue-200 shadow-md">
              {post.userId?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base md:text-lg">{post.userId?.fullName || 'User'}</h3>
              </div>
              <p className="text-xs md:text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <p className="text-gray-800 mb-4 md:mb-5 leading-relaxed text-sm md:text-base">{post.content}</p>

        {/* Related Task Badge */}
        {post.relatedTask && (
          <div className="mb-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-medium bg-blue-50 border-blue-200">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span className="text-xs md:text-sm text-blue-700">{post.relatedTask?.taskDescription || 'Task'}</span>
          </div>
        )}

        {/* Reactions Bar */}
        <div className="flex items-center justify-between pt-4 md:pt-5 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleLike(post._id)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all ${
                isLiked ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <ThumbsUp 
                className="w-5 h-5" 
                style={{ color: isLiked ? '#2563eb' : '#6b7280' }}
                fill={isLiked ? '#2563eb' : 'none'}
              />
              <span className={`text-xs md:text-sm ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}>
                {post.likes?.length || 0}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl hover:bg-gray-100 transition-all font-medium"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <span className="text-xs md:text-sm text-gray-600">{post.comments?.length || 0}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments[post._id] && (
          <div className="mt-5 md:mt-6 pt-5 md:pt-6 border-t border-gray-100">
            <div className="space-y-3 mb-4">
              {post.comments?.map((comment, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {comment.userId?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3 md:p-3.5">
                    <p className="text-xs md:text-sm font-semibold text-gray-900">{comment.userId?.fullName || 'User'}</p>
                    <p className="text-xs md:text-sm text-gray-700 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={commentInput[post._id] || ''}
                onChange={(e) => setCommentInput(prev => ({ ...prev, [post._id]: e.target.value }))}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2.5 bg-blue-50 border-2 border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <button
                onClick={() => handleComment(post._id)}
                className="px-4 md:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-xs md:text-sm font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
                disabled={!commentInput[post._id]?.trim()}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <Loader className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Global Stories Feed</h1>
          </div>
          <p className="text-gray-600 text-base sm:text-lg md:text-lg max-w-3xl">Discover inspiring stories from our community. Share your achievements and celebrate others.</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-white/20 py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Total Members</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{posts.length}+</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-purple-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Stories Posted</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-red-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Reactions</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}+</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border border-yellow-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-200">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Top Story</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{posts.length > 0 ? 'Latest' : 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stories Feed - Main Column */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 md:p-6 mb-6 flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 font-semibold mb-3">{error}</p>
                  <button 
                    onClick={fetchPosts} 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <p className="text-gray-600 text-base md:text-lg">No stories yet. Be the first to share!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {user && (
              <button
                onClick={() => setShowPostModal(true)}
                className="w-full px-6 py-3 md:py-4 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Zap className="w-5 h-5" />
                Share Your Story
              </button>
            )}

            {/* Community Guidelines */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-5 md:p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Community Guidelines
              </h3>
              <ul className="space-y-2.5 text-xs md:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>Be respectful and kind to all members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>Share authentic experiences only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>No spam or self-promotion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>Maintain privacy of others</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Post Story Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pt-20">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Share Your Story</h2>
                <p className="text-blue-100 mt-1 text-sm md:text-base">Inspire others with your experiences</p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-2 hover:bg-blue-500 rounded-lg transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6 md:space-y-8">
              {/* User Info */}
              {user && (
                <div className="flex items-center gap-4 p-4 md:p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl">
                    {user.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{user.fullName || 'User'}</h3>
                    <p className="text-sm text-gray-600">Community Member</p>
                  </div>
                </div>
              )}

              {/* Story Text */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  📖 What's Your Story?
                </label>
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share your experience, achievements, or how you helped someone today..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white resize-none transition-all bg-gray-50"
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-2">{postText.length} / 1000 characters</p>
              </div>

              {/* Related Task */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🎯 Link to a Task (Optional)
                </label>
                <input
                  type="text"
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  placeholder="Enter task name or leave blank"
                  className="w-full px-4 py-3 bg-blue-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Privacy Notice */}
              <div className="rounded-xl p-4 md:p-5 border-l-4 border-blue-600 bg-blue-50">
                <p className="text-xs md:text-sm text-gray-700">
                  <span className="font-bold">🔒 Privacy:</span> Your story will be visible to all platform users. Please ensure you're comfortable sharing this publicly!
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 md:p-8 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPostModal(false)}
                className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 transition-all border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!postText.trim()}
                className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-all flex items-center gap-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg`}
              >
                <Zap className="w-5 h-5" />
                Post Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feeds;
