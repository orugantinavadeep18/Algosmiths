import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Loader, AlertCircle, Search, Users, MapPin, Star, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { connectionAPI } from '../services/api';

// Helper function to format location
const formatLocation = (locationData) => {
  if (!locationData) return null;
  if (typeof locationData === 'string') return locationData;
  if (typeof locationData === 'object') return 'Location set';
  return null;
};

export default function Connection() {
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actioningUserId, setActioningUserId] = useState(null);

  useEffect(() => {
    const fetchConnectionData = async () => {
      try {
        setLoading(true);
        
        if (activeTab === 'connections') {
          const response = await connectionAPI.getConnections();
          setConnections(response.connections || []);
        } else {
          const response = await connectionAPI.getPendingRequests();
          setPendingRequests(response.requests || []);
        }
      } catch (err) {
        setError(`Failed to load ${activeTab}`);
        console.error(`Error fetching ${activeTab}:`, err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnectionData();
  }, [activeTab]);

  const handleAcceptRequest = async (requestId) => {
    try {
      setActioningUserId(requestId);
      await connectionAPI.acceptConnection(requestId);
      setPendingRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (err) {
      console.error('Error accepting request:', err);
      setError('Failed to accept request');
    } finally {
      setActioningUserId(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setActioningUserId(requestId);
      await connectionAPI.rejectConnection(requestId);
      setPendingRequests(prev => prev.filter(req => req._id !== requestId));
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError('Failed to reject request');
    } finally {
      setActioningUserId(null);
    }
  };

  const filteredData = activeTab === 'connections'
    ? connections.filter(conn => conn.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : pendingRequests.filter(req => req.requester?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ backgroundColor: '#fdfaf7' }} className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
            <Users className="w-10 h-10" />
            Connections
          </h1>
          <p className="text-blue-50 mt-2">Build your professional network</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-gray-50"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 sticky top-24 z-10">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 py-4 px-6 font-semibold transition whitespace-nowrap ${
                activeTab === 'connections'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Connections ({connections.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-4 px-6 font-semibold transition whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📩 Pending ({pendingRequests.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No {activeTab} found</h3>
            <p className="text-gray-600">Start connecting with other users</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(item => {
              const user = activeTab === 'connections' ? item : item.requester;
              const itemId = item._id;
              
              return (
                <div key={itemId} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition p-6">
                  {/* User Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    {formatLocation(user?.location) && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{formatLocation(user?.location)}</span>
                      </div>
                    )}
                    {user?.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">{user.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {user?.bio && (
                    <p className="text-sm text-gray-700 mb-6 line-clamp-2">{user.bio}</p>
                  )}

                  {/* Action Buttons */}
                  {activeTab === 'requests' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRejectRequest(itemId)}
                        disabled={actioningUserId === itemId}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition ${
                          actioningUserId === itemId
                            ? 'bg-gray-400 text-white'
                            : 'border-2 border-red-600 text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {actioningUserId === itemId ? 'Processing...' : 'Reject'}
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(itemId)}
                        disabled={actioningUserId === itemId}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition ${
                          actioningUserId === itemId
                            ? 'bg-gray-400 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                        }`}
                      >
                        {actioningUserId === itemId ? 'Processing...' : 'Accept'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
