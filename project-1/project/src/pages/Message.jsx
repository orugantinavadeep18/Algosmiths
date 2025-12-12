import React, { useState, useEffect } from 'react';
import { Send, Loader, AlertCircle, Search, MessageCircle, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { messageAPI, userAPI } from '../services/api';

export default function Message() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchChatHistory(selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messageAPI.getConversations();
      setConversations(response.conversations || []);
      if (response.conversations && response.conversations.length > 0) {
        setSelectedConversation(response.conversations[0]);
      }
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (conversationId) => {
    try {
      const response = await messageAPI.getChatHistory(conversationId);
      setMessages(response.messages || []);
      await messageAPI.markAsSeen(conversationId);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const otherParticipant = selectedConversation.participants.find(
        p => p._id !== currentUser?._id
      );

      if (!otherParticipant) {
        setError('Cannot find recipient');
        return;
      }

      await messageAPI.sendMessage(otherParticipant._id, {
        text: messageText
      });

      setMessageText('');
      fetchChatHistory(selectedConversation._id);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div style={{ backgroundColor: '#fdfaf7' }} className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <Loader className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  }

  const otherUser = selectedConversation?.participants.find(
    p => p._id !== currentUser?._id
  );

  return (
    <div style={{ backgroundColor: '#fdfaf7' }} className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <MessageCircle className="w-8 h-8" />
            Messages
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          {/* Conversations Sidebar */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Conversations</h2>
              <div className="relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-gray-50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const otherParticipant = conv.participants.find(p => p._id !== currentUser?._id);
                  const isSelected = selectedConversation?._id === conv._id;
                  
                  return (
                    <button
                      key={conv._id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 border-b border-gray-100 text-left transition ${
                        isSelected
                          ? 'bg-blue-50 border-l-4 border-l-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {otherParticipant?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{otherParticipant?.name}</p>
                          <p className="text-xs text-gray-600 truncate">{otherParticipant?.email}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
            {selectedConversation && otherUser ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                      {otherUser.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{otherUser.name}</p>
                      <p className="text-xs text-gray-600">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-600">
                        <Zap className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm">Start a conversation</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isOwn = msg.sender?._id === currentUser?._id;
                      return (
                        <div
                          key={idx}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2.5 rounded-xl ${
                              isOwn
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-600'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim() || sending}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {sending ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-600">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
