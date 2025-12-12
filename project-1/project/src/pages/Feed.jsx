import React, { useState } from 'react';
import { Heart, ThumbsUp, Laugh, MessageCircle, Share2, X, Image, Briefcase } from 'lucide-react';

const GlobalStoriesFeed = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [selectedTask, setSelectedTask] = useState('');

  const stories = [
    {
      id: 1,
      user: { name: 'Rajesh Kumar', avatar: 'RK', level: 12, xp: 2450 },
      time: '2 hours ago',
      text: 'Just helped a local farmer organize his storage shed. It felt amazing to see how much more efficient his workflow became!',
      image: null,
      relatedTask: 'Farm storage organization',
      reactions: { likes: 45, hearts: 23, laughs: 5 },
      comments: 8
    },
    {
      id: 2,
      user: { name: 'Priya Sharma', avatar: 'PS', level: 8, xp: 1680 },
      time: '5 hours ago',
      text: 'Delivered groceries to an elderly couple today. They were so grateful and even offered me tea!',
      image: null,
      relatedTask: 'Grocery delivery',
      reactions: { likes: 67, hearts: 89, laughs: 2 },
      comments: 15
    },
    {
      id: 3,
      user: { name: 'Amit Patel', avatar: 'AP', level: 15, xp: 3200 },
      time: '8 hours ago',
      text: 'Fixed a laptop for a small business owner. Tech help can truly transform lives.',
      image: null,
      relatedTask: 'Laptop repair',
      reactions: { likes: 34, hearts: 28, laughs: 1 },
      comments: 6
    },
    {
      id: 4,
      user: { name: 'Sneha Reddy', avatar: 'SR', level: 10, xp: 2100 },
      time: '1 day ago',
      text: 'Spent the afternoon cleaning the community hall for an upcoming event.',
      image: null,
      relatedTask: 'Community hall cleaning',
      reactions: { likes: 52, hearts: 41, laughs: 3 },
      comments: 12
    },
    {
      id: 5,
      user: { name: 'Vikram Singh', avatar: 'VS', level: 6, xp: 980 },
      time: '1 day ago',
      text: 'Tutored three kids in mathematics today. Education is the best investment.',
      image: null,
      relatedTask: 'Math tutoring',
      reactions: { likes: 78, hearts: 65, laughs: 4 },
      comments: 20
    }
  ];

  const myCompletedTasks = [
    'Grocery delivery for Mr. Sharma',
    'Tech support - Router setup',
    'Farm work assistance',
    'Document writing help',
    'Pet sitting service'
  ];

  const StoryCard = ({ story }) => {
    const [reacted, setReacted] = useState({
      like: false,
      heart: false,
      laugh: false
    });

    const handleReaction = (type) => {
      setReacted(prev => ({ ...prev, [type]: !prev[type] }));
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {story.user.avatar}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">{story.user.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{story.time}</p>
            </div>
          </div>
        </div>

        <p className="text-gray-800 mb-3 leading-relaxed text-sm sm:text-base">{story.text}</p>

        {story.relatedTask && (
          <div className="mb-4 inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border"
            style={{ backgroundColor: '#fdfaf7', borderColor: '#d7c3f1' }}
          >
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: '#3f5ed9' }} />
            <span className="text-xs sm:text-sm font-medium text-gray-700">{story.relatedTask}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* LIKE */}
            <button
              onClick={() => handleReaction('like')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all ${reacted.like ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            >
              <ThumbsUp
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: reacted.like ? '#3f5ed9' : '#6b7280' }}
                fill={reacted.like ? '#3f5ed9' : 'none'}
              />
              <span className={`text-xs sm:text-sm font-medium ${reacted.like ? 'text-blue-600' : 'text-gray-600'}`}>
                {story.reactions.likes + (reacted.like ? 1 : 0)}
              </span>
            </button>

            {/* HEART */}
            <button
              onClick={() => handleReaction('heart')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all ${reacted.heart ? 'bg-red-50' : 'hover:bg-gray-50'}`}
            >
              <Heart
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: reacted.heart ? '#ef4444' : '#6b7280' }}
                fill={reacted.heart ? '#ef4444' : 'none'}
              />
              <span className={`text-xs sm:text-sm font-medium ${reacted.heart ? 'text-red-600' : 'text-gray-600'}`}>
                {story.reactions.hearts + (reacted.heart ? 1 : 0)}
              </span>
            </button>

            {/* LAUGH */}
            <button
              onClick={() => handleReaction('laugh')}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all ${reacted.laugh ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}
            >
              <Laugh
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: reacted.laugh ? '#f8c80a' : '#6b7280' }}
                fill={reacted.laugh ? '#f8c80a' : 'none'}
              />
              <span className={`text-xs sm:text-sm font-medium ${reacted.laugh ? 'text-yellow-600' : 'text-gray-600'}`}>
                {story.reactions.laughs + (reacted.laugh ? 1 : 0)}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 transition-all">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="text-xs sm:text-sm font-medium text-gray-600">{story.comments}</span>
            </button>

            <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 transition-all">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#fdfaf7' }} className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Global Stories</h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">Share your experiences and inspire others</p>
            </div>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-white shadow-sm hover:opacity-90 transition-all text-sm sm:text-base whitespace-nowrap"
              style={{ backgroundColor: '#3f5ed9' }}
            >
              Post Story
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {stories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Share Your Story</h2>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  YU
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Your Name</h3>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  What's your story?
                </label>
                <textarea
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="Share your experience helping others today..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 resize-none text-sm sm:text-base"
                  rows={6}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Link to a task (optional)
                </label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
                >
                  <option value="">Select a completed task...</option>
                  {myCompletedTasks.map((task, idx) => (
                    <option key={idx} value={task}>{task}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Add a photo (optional)
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  style={{ borderColor: '#d7c3f1' }}
                >
                  <Image className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" style={{ color: '#d7c3f1' }} />
                  <p className="text-xs sm:text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: '#fdfaf7', borderLeft: '4px solid #3f5ed9' }}>
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold">Note:</span> Your story will be public on the platform.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPostModal(false)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-white shadow-sm hover:opacity-90 transition-all text-sm sm:text-base"
                style={{ backgroundColor: '#3f5ed9' }}
              >
                Post Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalStoriesFeed;