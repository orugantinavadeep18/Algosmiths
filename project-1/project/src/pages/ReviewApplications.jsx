import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, MessageCircle, Star, Loader, MapPin, DollarSign, Clock, Filter, Search, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import { applicationAPI, messageAPI } from '../services/api';

// Helper function to format location
const formatLocation = (locationData) => {
  if (!locationData) return 'Not specified';
  if (typeof locationData === 'string') return locationData;
  if (typeof locationData === 'object') return 'Location set';
  return 'Not specified';
};

export default function ReviewApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [actioningAppId, setActioningAppId] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getApplications();
      setApplications(response.applications || []);
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appId) => {
    try {
      setActioningAppId(appId);
      await applicationAPI.acceptApplication(appId);
      setApplications(apps => apps.map(app => 
        app._id === appId ? { ...app, status: 'accepted' } : app
      ));
    } catch (err) {
      setError('Failed to accept application');
      console.error('Error accepting application:', err);
    } finally {
      setActioningAppId(null);
    }
  };

  const handleReject = async (appId) => {
    try {
      setActioningAppId(appId);
      await applicationAPI.rejectApplication(appId);
      setApplications(apps => apps.map(app => 
        app._id === appId ? { ...app, status: 'rejected' } : app
      ));
    } catch (err) {
      setError('Failed to reject application');
      console.error('Error rejecting application:', err);
    } finally {
      setActioningAppId(null);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedApp) return;

    try {
      await messageAPI.sendMessage(selectedApp.applicant._id, {
        text: messageText,
        taskId: selectedApp.task._id
      });
      setMessageText('');
      setShowMessageModal(false);
      alert('Message sent successfully!');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesTab = 
      (activeTab === 'pending' && app.status === 'pending') ||
      (activeTab === 'accepted' && app.status === 'accepted') ||
      (activeTab === 'rejected' && app.status === 'rejected') ||
      activeTab === 'all';
    
    const matchesSearch = 
      app.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.task?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#fdfaf7' }} className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
            <TrendingUp className="w-10 h-10" />
            Review Applications
          </h1>
          <p className="text-blue-50 mt-2">Manage task applications and hire talented workers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by applicant name or task..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 sticky top-24 z-10">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex-1 py-4 px-6 font-semibold transition whitespace-nowrap ${
                    activeTab === 'pending'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ⏳ Pending ({applications.filter(a => a.status === 'pending').length})
                </button>
                <button
                  onClick={() => setActiveTab('accepted')}
                  className={`flex-1 py-4 px-6 font-semibold transition whitespace-nowrap ${
                    activeTab === 'accepted'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✓ Accepted ({applications.filter(a => a.status === 'accepted').length})
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`flex-1 py-4 px-6 font-semibold transition whitespace-nowrap ${
                    activeTab === 'rejected'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✕ Rejected ({applications.filter(a => a.status === 'rejected').length})
                </button>
              </div>
            </div>

            {/* Applications Grid */}
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">Check back later for new applications</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map(app => (
                  <div key={app._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{app.task?.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{app.task?.category}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status === 'pending' ? '⏳ Pending' :
                           app.status === 'accepted' ? '✓ Accepted' :
                           '✕ Rejected'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{app.task?.description}</p>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Applicant Info */}
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {app.applicant?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{app.applicant?.name}</p>
                          <p className="text-sm text-gray-600">{app.applicant?.email}</p>
                          {app.applicant?.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm text-gray-700 font-semibold">{app.applicant.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Task Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <MapPin className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">{formatLocation(app.task?.location)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-sm font-medium">${app.task?.paymentAmount}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Clock className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Application Message */}
                      {app.message && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Applicant's Message:</p>
                          <p className="text-sm text-gray-700">{app.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="border-t border-gray-100 p-6 bg-gray-50 flex gap-3">
                      {app.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleReject(app._id)}
                            disabled={actioningAppId === app._id}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                              actioningAppId === app._id
                                ? 'bg-gray-400 text-white'
                                : 'border-2 border-red-600 text-red-600 hover:bg-red-50'
                            }`}
                          >
                            {actioningAppId === app._id ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Reject
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleAccept(app._id)}
                            disabled={actioningAppId === app._id}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                              actioningAppId === app._id
                                ? 'bg-gray-400 text-white'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                            }`}
                          >
                            {actioningAppId === app._id ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Accepting...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { setSelectedApp(app); setShowMessageModal(true); }}
                          className="flex-1 px-4 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Send Message</h2>
            <p className="text-gray-600 mb-4">To: <span className="font-semibold">{selectedApp.applicant?.name}</span></p>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              rows="5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowMessageModal(false); setMessageText(''); }}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
