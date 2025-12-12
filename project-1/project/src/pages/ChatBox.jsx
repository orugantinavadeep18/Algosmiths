import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Clock, MessageCircle, Loader, X } from 'lucide-react';
import { messageAPI, taskAPI } from '../services/api';

export default function ChatBox({ taskId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [sending, setSending] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const currentUserId = currentUser?.id || currentUser?._id;
  const isUserAtBottomRef = useRef(true);

  useEffect(() => {
    if (taskId) {
      fetchChat();
      fetchTaskDetails();

      // Auto-refresh messages every 2 seconds for real-time updates
      const interval = setInterval(() => {
        fetchChat();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [taskId]);

  // Auto-scroll to latest message only if user is at bottom
  useEffect(() => {
    if (isUserAtBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchChat = async () => {
    try {
      const response = await messageAPI.getTaskChat(taskId);
      setMessages(response.messages || []);
    } catch (err) {
      console.error('Error fetching chat:', err);
    } finally {
      setLoading(false);
    }
  };

  // Track scroll position to detect if user is at bottom
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // Consider user at bottom if within 100px of the bottom
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    isUserAtBottomRef.current = isAtBottom;
  };

  const fetchTaskDetails = async () => {
    try {
      const response = await taskAPI.getTaskById(taskId);
      const taskData = response.task || response.data;
      setTask(taskData);
      
      // Determine the other user based on currentUser ID
      let otherUserData = null;
      
      // Check if current user is the task poster
      if (taskData?.postedBy?._id === currentUserId || taskData?.postedBy === currentUserId) {
        // Current user is poster, other user is the selected worker
        otherUserData = taskData?.selectedWorker;
      } else {
        // Current user is the worker, other user is the poster
        otherUserData = taskData?.postedBy;
      }
      
      if (otherUserData) {
        setOtherUser(otherUserData);
      }
    } catch (err) {
      console.error('Error fetching task:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUser) return;

    const messageText = newMessage;
    setNewMessage('');
    setSending(true);
    
    try {
      await messageAPI.sendMessage(taskId, otherUser._id, messageText);
      await fetchChat();
    } catch (err) {
      console.error('Error sending message:', err);
      setNewMessage(messageText);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleCompleteTask = async () => {
    if (!window.confirm('Are you sure you want to complete this task?')) return;

    try {
      await taskAPI.completeTask(taskId);
      alert('Task completed successfully!');
      onBack();
    } catch (err) {
      console.error('Error completing task:', err);
      alert('Failed to complete task');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  const isCompleted = task?.status === 'completed';
  const isTaskPoster = currentUserId === task?.postedBy?._id;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
      {/* Modal Container */}
      <div className="bg-white w-full sm:w-full md:max-w-2xl h-screen sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modern Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-3 sm:p-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm sm:text-base truncate">{task?.taskDescription?.substring(0, 35)}...</p>
              <p className="text-xs sm:text-sm text-blue-100 flex items-center gap-1 mt-1">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">Chat with {otherUser?.fullName}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isCompleted ? (
                <div className="flex items-center gap-1 bg-green-500/30 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-green-400/50">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Completed</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-amber-500/30 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-amber-400/50">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">In Progress</span>
                </div>
              )}
              <button
                onClick={onBack}
                className="p-1 sm:p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                title="Close chat"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="mb-4 p-3 bg-white rounded-2xl shadow-sm">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto" />
            </div>
            <p className="text-gray-500 font-medium text-xs sm:text-sm">No messages yet</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Start the conversation by sending a message below</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isFromCurrentUser = msg.fromUserId._id === currentUserId;
            return (
              <div
                key={idx}
                className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-xs px-3 py-2 sm:px-4 sm:py-3 rounded-2xl transition-all duration-200 hover:shadow-md text-sm sm:text-base ${
                    isFromCurrentUser
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none shadow-md'
                      : 'bg-white text-gray-900 rounded-bl-none shadow-sm border border-gray-200'
                  }`}
                >
                  <p className={`text-xs sm:text-sm font-bold mb-1 ${isFromCurrentUser ? 'text-blue-100' : 'text-gray-600'}`}>
                    {msg.fromUserId.fullName}
                  </p>
                  <p className="leading-relaxed break-words">{msg.text}</p>
                  <p className={`text-xs mt-1 ${isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isCompleted ? (
        <div className="border-t border-white/20 bg-white/50 backdrop-blur-sm p-3 sm:p-4 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 mb-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-white border-2 border-gray-200 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm disabled:opacity-50"
              disabled={sending || isCompleted}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim() || isCompleted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 font-semibold text-sm hover:scale-105 flex-shrink-0"
            >
              {sending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </form>

          {/* Complete Button - Only for task poster */}
          {isTaskPoster && (
            <button
              onClick={handleCompleteTask}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 sm:py-2.5 rounded-full hover:shadow-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 text-sm"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Complete Task
            </button>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t-2 border-green-200 p-3 sm:p-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <p className="text-center text-green-700 font-semibold text-xs sm:text-sm">
              Task completed! Chat closed.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      </div>
    </div>
  );
}