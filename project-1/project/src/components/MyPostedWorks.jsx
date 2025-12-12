import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import { MapPin, DollarSign, Clock, Users, ChevronDown, Loader, AlertCircle, CheckCircle, User, Mail, Phone } from 'lucide-react';

// Helper function to format location
const formatLocation = (locationData) => {
  if (!locationData) return 'Not specified';
  if (typeof locationData === 'string') return locationData;
  if (typeof locationData === 'object') return 'Location set';
  return 'Not specified';
};

const MyPostedWorks = ({ isOpen, onClose, onChatClick }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [applicationsData, setApplicationsData] = useState({});
  const [selecting, setSelecting] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPostedTasks();
    }
  }, [isOpen]);

  const fetchPostedTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getMyPostedTasks();
      setTasks(response.tasks || []);
      setError(null);
    } catch (err) {
      setError('Failed to load posted tasks');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (taskId) => {
    try {
      if (applicationsData[taskId]) {
        setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
        return;
      }

      const response = await taskAPI.getTaskApplications(taskId);
      setApplicationsData(prev => ({
        ...prev,
        [taskId]: response.applications || []
      }));
      setSelectedTaskId(selectedTaskId === taskId ? null : taskId);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    }
  };

  const handleSelectWorker = async (taskId, workerId) => {
    try {
      setSelecting({ taskId, workerId });
      await taskAPI.selectWorker(taskId, workerId);
      
      // Update task
      setTasks(tasks.map(task => 
        task._id === taskId 
          ? { ...task, selectedWorker: { _id: workerId }, workStatus: 'in-progress' }
          : task
      ));
      
      setError(null);
    } catch (err) {
      setError('Failed to select worker');
      console.error('Error:', err);
    } finally {
      setSelecting(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Posted Works</h2>
            <p className="text-indigo-100 text-sm mt-1">Manage your posted tasks and select workers</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin w-8 h-8 text-indigo-600" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posted Works Yet</h3>
              <p className="text-gray-600">Start by posting a task to manage applications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                  {/* Task Header */}
                  <div 
                    onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}
                    className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{task.taskCategory}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getWorkStatusColor(task.workStatus)}`}>
                          {task.workStatus}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{task.taskDescription?.substring(0, 100)}...</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold">${task.paymentAmount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{formatLocation(task.location)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{task.applications?.length || 0} applications</span>
                        </div>
                        {task.selectedWorker && (
                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            <span>Worker Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-500 transition-transform ${expandedTaskId === task._id ? 'rotate-180' : ''}`}
                    />
                  </div>

                  {/* Expanded Content */}
                  {expandedTaskId === task._id && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Task Details</h4>
                        <p className="text-sm text-gray-700 mb-3">{task.taskDescription}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Task Type</p>
                            <p className="font-semibold text-gray-900">{task.taskType}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Location</p>
                            <p className="font-semibold text-gray-900">{formatLocation(task.location)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Payment</p>
                            <p className="font-semibold text-gray-900">${task.paymentAmount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status</p>
                            <p className="font-semibold text-gray-900 capitalize">{task.workStatus}</p>
                          </div>
                        </div>
                      </div>

                      {/* Selected Worker Info */}
                      {task.selectedWorker && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-3">Selected Worker</h4>
                          <div className="flex items-center gap-4 justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white font-bold">
                                {task.selectedWorker.fullName?.charAt(0).toUpperCase() || 'W'}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{task.selectedWorker.fullName}</p>
                                <p className="text-sm text-gray-600">@{task.selectedWorker.username}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="font-semibold">Active</span>
                                </div>
                              </div>
                            </div>
                            {task.status !== 'completed' && (
                              <button
                                onClick={() => onChatClick && onChatClick(task._id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap ml-4 transition"
                              >
                                💬 Chat
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Applications Section */}
                      <div>
                        <button
                          onClick={() => fetchApplications(task._id)}
                          className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg font-semibold text-indigo-700 transition mb-3"
                        >
                          {selectedTaskId === task._id ? 'Hide Applications' : `View Applications (${task.applications?.length || 0})`}
                        </button>

                        {selectedTaskId === task._id && applicationsData[task._id] && (
                          <div className="space-y-3">
                            {applicationsData[task._id].length === 0 ? (
                              <p className="text-center py-4 text-gray-600">No applications yet</p>
                            ) : (
                              applicationsData[task._id].map(app => (
                                <div key={app._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                          {app.applicantId?.fullName?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900">{app.applicantId?.fullName}</p>
                                          <p className="text-xs text-gray-600">@{app.applicantId?.username}</p>
                                        </div>
                                      </div>
                                      
                                      {app.applicantId?.email && (
                                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                          <Mail className="w-4 h-4" />
                                          <span>{app.applicantId.email}</span>
                                        </div>
                                      )}
                                      
                                      {app.applicantId?.rating && (
                                        <div className="text-sm">
                                          <span className="text-yellow-500">★</span>
                                          <span className="font-semibold text-gray-900"> {app.applicantId.rating.toFixed(1)}</span>
                                          <span className="text-gray-600"> rating</span>
                                        </div>
                                      )}
                                      
                                      {app.message && (
                                        <p className="mt-2 text-sm text-gray-700 italic">"{app.message}"</p>
                                      )}
                                    </div>
                                    
                                    <button
                                      onClick={() => handleSelectWorker(task._id, app.applicantId._id)}
                                      disabled={task.selectedWorker?._id === app.applicantId._id || selecting?.taskId === task._id}
                                      className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ml-4 transition ${
                                        task.selectedWorker?._id === app.applicantId._id
                                          ? 'bg-green-100 text-green-700 cursor-default'
                                          : selecting?.taskId === task._id
                                          ? 'bg-gray-200 text-gray-600 cursor-wait'
                                          : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                                      }`}
                                    >
                                      {task.selectedWorker?._id === app.applicantId._id ? (
                                        <span className="flex items-center gap-1">
                                          <CheckCircle className="w-4 h-4" />
                                          Selected
                                        </span>
                                      ) : selecting?.taskId === task._id ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                      ) : (
                                        'Select Worker'
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPostedWorks;
