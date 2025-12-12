import React, { useEffect, useState } from 'react';
import { Users, BarChart3, TrendingUp, Activity, LogOut, Trash2, Power } from 'lucide-react';
import Navbar from '../components/Navbar';
import { adminAPI, authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashData = await adminAPI.getDashboard();
        setAnalytics(dashData.analytics);
        setUsers(dashData.users);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('adminToken');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleToggleUser = async (userId, currentStatus) => {
    try {
      await adminAPI.toggleUserStatus(userId, !currentStatus);
      // Refresh data
      const dashData = await adminAPI.getDashboard();
      setAnalytics(dashData.analytics);
      setUsers(dashData.users);
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      setDeleteConfirm(null);
      // Refresh data
      const dashData = await adminAPI.getDashboard();
      setAnalytics(dashData.analytics);
      setUsers(dashData.users);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage users and view platform analytics</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalUsers}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Users</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{analytics.activeUsers}</p>
                    <p className="text-xs text-gray-500 mt-1">{analytics.activePercentage}% online</p>
                  </div>
                  <Activity className="w-10 h-10 text-green-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{analytics.totalTasks}</p>
                    <p className="text-xs text-gray-500 mt-1">{analytics.completionRate}% completed</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-purple-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Tasks</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{analytics.activeTasks}</p>
                    <p className="text-xs text-gray-500 mt-1">{analytics.pendingTasks} pending</p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-orange-600 opacity-20" />
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Users Management
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Statistics Cards */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Platform Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Inactive Users</span>
                    <span className="text-2xl font-bold text-gray-900">{analytics.inactiveUsers}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Completed Tasks</span>
                    <span className="text-2xl font-bold text-blue-600">{analytics.completedTasks}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                    <span className="text-gray-700 font-medium">Completion Rate</span>
                    <span className="text-2xl font-bold text-purple-600">{analytics.completionRate}%</span>
                  </div>
                </div>
              </div>

              {/* User Growth */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Active Users</span>
                      <span className="text-sm font-bold text-green-600">{analytics.activePercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${analytics.activePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Task Completion</span>
                      <span className="text-sm font-bold text-blue-600">{analytics.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${analytics.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Management Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Username</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Completed</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-all">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">@{user.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.fullName || '-'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {user.completedTasks || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ⭐ {user.rating?.toFixed(1) || '0.0'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleUser(user._id, user.isActive)}
                              className={`p-2 rounded-lg transition-all ${
                                user.isActive
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                  : 'bg-green-100 text-green-600 hover:bg-green-200'
                              }`}
                              title={user.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <Power size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(user._id)}
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
