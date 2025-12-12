import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, MapPin, Menu, X, Loader, Star, Phone, Mail, Briefcase, AlertCircle } from 'lucide-react';
import { taskAPI, applicationAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Task Details Modal
const TaskDetailsModal = ({ task, onClose, onApply, isApplying, isAlreadyApplied, isOwnTask }) => {
  if (!task) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        padding: '2rem',
        maxWidth: '42rem',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '0.5rem'
          }}
        >
          ✕
        </button>

        {/* Posted By Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #3f5ed9 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '700',
            flexShrink: 0
          }}>
            {task.postedBy?.fullName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>
              {task.postedBy?.fullName || 'Unknown User'}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>@{task.postedBy?.username || 'user'}</p>
            {task.postedBy?.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      style={{
                        fill: i < Math.round(task.postedBy.rating) ? 'currentColor' : 'none'
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>{task.postedBy.rating}</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({task.postedBy.totalReviews || 0})</span>
              </div>
            )}
          </div>
        </div>

        {/* Task Details */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: '0 0 0.75rem 0', lineHeight: '1.3' }}>
            {task.taskDescription?.substring(0, 100) || 'Task Details'}
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              backgroundColor: '#dbeafe',
              color: '#0369a1',
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              {task.taskCategory || 'General'}
            </span>
            <span style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              padding: '0.375rem 0.875rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              {task.taskType || 'One-time'}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Payment</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>₹{task.paymentAmount || 0}</p>
          </div>
          <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', margin: '0 0 0.5rem 0', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} /> Location
            </p>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>{task.location || 'Not specified'}</p>
          </div>
        </div>

        {/* Full Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Description</h3>
          <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
            {task.taskDescription || 'No description provided'}
          </p>
        </div>

        {/* Additional Notes */}
        {task.additionalNotes && (
          <div style={{ marginBottom: '1.5rem', backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #bfdbfe' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>Additional Notes</h3>
            <p style={{ color: '#0c4a6e', margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{task.additionalNotes}</p>
          </div>
        )}

        {/* Contact Info */}
        <div style={{ marginBottom: '1.5rem', backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #bbf7d0' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#166534', textTransform: 'uppercase', marginBottom: '0.75rem', margin: '0 0 0.75rem 0' }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {task.postedBy?.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontSize: '0.875rem' }}>
                <Mail size={14} />
                <span>{task.postedBy.email}</span>
              </div>
            )}
            {task.phoneNumber && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontSize: '0.875rem' }}>
                <Phone size={14} />
                <span>{task.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: '#f3f4f6',
              color: '#111827',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Close
          </button>
          {!isOwnTask && (
            <button
              onClick={onApply}
              disabled={isApplying || isAlreadyApplied}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: isAlreadyApplied ? '#d1d5db' : '#3f5ed9',
                color: isAlreadyApplied ? '#6b7280' : 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: isAlreadyApplied ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isApplying ? (
                <>
                  <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Applying...
                </>
              ) : isAlreadyApplied ? (
                '✓ Applied'
              ) : (
                'Apply Now'
              )}
            </button>
          )}
        </div>

        {isOwnTask && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '0.75rem',
            color: '#92400e',
            fontSize: '0.875rem',
            fontWeight: '600',
            textAlign: 'center',
            marginTop: '1rem'
          }}>
            ℹ This is your task - you cannot apply
          </div>
        )}
      </div>
    </div>
  );
};

const FilterSidebar = ({ isMobile, filters, onFilterChange, onShowFilters }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '1.5rem',
    ...(isMobile ? {} : { 
      position: 'sticky', 
      top: '6rem',
      maxHeight: 'calc(100vh - 8rem)',
      overflowY: 'auto'
    })
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <h2 style={{ fontWeight: '700', fontSize: '1.125rem', color: '#111827', margin: 0 }}>Filters</h2>
      {isMobile && (
        <button onClick={() => onShowFilters(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.25rem' }}>
          <X size={24} color="#374151" />
        </button>
      )}
    </div>

    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '1.125rem', height: '1.125rem' }} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem 1rem 0.625rem 2.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>

    <div style={{ borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem', fontSize: '0.875rem' }}>Category</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {['Technology', 'Home & Garden', 'Cleaning', 'Delivery', 'Tutoring'].map((cat, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.category.includes(cat)}
              onChange={(e) => {
                const newCats = e.target.checked
                  ? [...filters.category, cat]
                  : filters.category.filter(c => c !== cat);
                onFilterChange('category', newCats);
              }}
              style={{ width: '1rem', height: '1rem', accentColor: '#3f5ed9', borderRadius: '0.25rem', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>{cat}</span>
          </label>
        ))}
      </div>
    </div>

    <div style={{ borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem', fontSize: '0.875rem' }}>Budget Range</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="range"
          min="0"
          max="100000"
          value={filters.priceRange}
          onChange={(e) => onFilterChange('priceRange', Number(e.target.value))}
          style={{
            width: '100%',
            height: '0.5rem',
            background: '#e5e7eb',
            borderRadius: '0.5rem',
            accentColor: '#3f5ed9',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#4b5563' }}>
          <span>₹0</span>
          <span>₹{filters.priceRange.toLocaleString()}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function AcceptTask() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingTaskId, setApplyingTaskId] = useState(null);
  const [appliedTasks, setAppliedTasks] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: [], priceRange: 100000 });
  const [successMessage, setSuccessMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchTasks();
    fetchAppliedTasks();
  }, []);

  const fetchAppliedTasks = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      const appliedMap = {};
      if (response && response.applications) {
        response.applications.forEach(app => {
          appliedMap[app.taskId] = true;
        });
      }
      setAppliedTasks(appliedMap);
    } catch (err) {
      console.error('Error fetching applied tasks:', err);
    }
  };

  useEffect(() => {
    filterTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      setTasks(response.tasks || []);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let result = [...tasks];

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task =>
        task.taskDescription?.toLowerCase().includes(searchLower) ||
        task.taskCategory?.toLowerCase().includes(searchLower) ||
        task.location?.toLowerCase().includes(searchLower) ||
        task.postedBy?.fullName?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (filters.category.length > 0) {
      result = result.filter(task => filters.category.includes(task.taskCategory));
    }

    // Filter by price range
    result = result.filter(task => (task.paymentAmount || 0) <= filters.priceRange);

    setFilteredTasks(result);
  };

  const handleApplyTask = async (taskId) => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Apply Task - Auth Check:', { authToken: !!authToken, userId: userData.id });
    
    if (!authToken || !userData.id) {
      console.log('No auth token or user ID, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      console.log('Attempting to apply for task:', taskId);
      setApplyingTaskId(taskId);
      const response = await applicationAPI.applyForTask(taskId, {
        message: 'I am interested in this task and would like to apply.'
      });
      console.log('Apply successful:', response);
      setAppliedTasks(prev => ({ ...prev, [taskId]: true }));
      setSuccessMessage('Application submitted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      if (selectedTask?._id === taskId) {
        setSelectedTask(null);
      }
    } catch (err) {
      console.error('Apply Error Details:', {
        message: err.message,
        status: err.status,
        fullError: err
      });
      
      // If it's a 401, token might be invalid
      if (err.message === 'Invalid token' || err.message.includes('401')) {
        console.log('Invalid token error - clearing storage and redirecting');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert(err.message || 'Failed to apply for this task');
      }
    } finally {
      setApplyingTaskId(null);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Navbar />

      {/* Back Button Bar */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', marginTop: '5rem', position: 'sticky', top: '5rem', zIndex: 40 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#4b5563',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              padding: 0
            }}
          >
            <ChevronLeft size={20} />
            Back to Home
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '6rem',
          left: '1rem',
          right: '1rem',
          maxWidth: '24rem',
          backgroundColor: '#dcfce7',
          border: '2px solid #86efac',
          borderRadius: '0.75rem',
          padding: '1rem',
          zIndex: 30,
          animation: 'slideDown 0.3s ease'
        }}>
          <p style={{ margin: 0, color: '#166534', fontWeight: '600', fontSize: '0.875rem' }}>
            ✓ {successMessage}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(true)}
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#3f5ed9',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            fontWeight: '500',
            width: '100%',
            justifyContent: 'center',
            fontSize: '0.875rem'
          }}
          className="mobile-filter-btn"
        >
          <Menu size={20} /> Show Filters
        </button>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Filters Sidebar */}
          <aside style={{ width: '320px', flexShrink: 0 }} className="desktop-filters">
            <FilterSidebar isMobile={false} filters={filters} onFilterChange={handleFilterChange} onShowFilters={setShowFilters} />
          </aside>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 100,
                display: 'none'
              }}
              className="mobile-filter-overlay"
              onClick={() => setShowFilters(false)}
            >
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '85%',
                  maxWidth: '320px',
                  backgroundColor: 'white',
                  overflowY: 'auto',
                  padding: '1rem'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <FilterSidebar isMobile={true} filters={filters} onFilterChange={handleFilterChange} onShowFilters={setShowFilters} />
              </div>
            </div>
          )}

          {/* Tasks Grid */}
          <main style={{ flex: 1 }}>
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Loader size={40} color="#3f5ed9" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            )}

            {error && (
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#fee2e2',
                borderRadius: '0.75rem',
                color: '#991b1b',
                marginBottom: '1.5rem',
                border: '1px solid #fca5a5',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{error}</p>
              </div>
            )}

            {!loading && filteredTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#6b7280' }}>
                <Briefcase size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
                <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>No tasks found</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  {filters.search ? 'Try adjusting your search' : 'Be the first to post a task!'}
                </p>
              </div>
            )}

            {/* Task Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }} className="task-grid">
              {filteredTasks.map((task) => {
                const isOwnTask = user._id === task.postedBy?._id;
                const isAlreadyApplied = appliedTasks[task._id];

                return (
                  <div
                    key={task._id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '1rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Posted By Info */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '0.75rem',
                          background: 'linear-gradient(135deg, #3f5ed9 0%, #7c3aed 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '1.25rem'
                        }}>
                          {task.postedBy?.fullName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '1.125rem', margin: '0 0 0.25rem 0', wordBreak: 'break-word' }}>
                            {task.postedBy?.fullName || 'Unknown User'}
                          </h3>
                          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>@{task.postedBy?.username || 'user'}</p>
                          {task.postedBy?.rating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: '#f59e0b', fontSize: '0.75rem' }}>
                              <Star size={12} style={{ fill: 'currentColor' }} />
                              <span>{task.postedBy.rating} ({task.postedBy.totalReviews || 0})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Task Description */}
                      <h4 style={{ fontWeight: '700', color: '#111827', fontSize: '1rem', margin: '0 0 0.5rem 0', lineHeight: '1.3' }}>
                        {task.taskDescription?.substring(0, 60)}...
                      </h4>

                      {/* Category & Location */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{
                          backgroundColor: '#dbeafe',
                          color: '#0369a1',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {task.taskCategory || 'General'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280', fontSize: '0.875rem' }}>
                          <MapPin size={14} />
                          <span>{task.location || 'Location TBD'}</span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      {isOwnTask && (
                        <div style={{
                          backgroundColor: '#fef3c7',
                          border: '1px solid #fcd34d',
                          color: '#92400e',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          marginBottom: '1rem',
                          textAlign: 'center'
                        }}>
                          Your Task
                        </div>
                      )}
                      {isAlreadyApplied && !isOwnTask && (
                        <div style={{
                          backgroundColor: '#dcfce7',
                          border: '1px solid #86efac',
                          color: '#166534',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          marginBottom: '1rem',
                          textAlign: 'center'
                        }}>
                          ✓ Already Applied
                        </div>
                      )}

                      {/* Payment & Actions */}
                      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Budget</p>
                            <span style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>₹{task.paymentAmount || 0}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button
                            onClick={() => setSelectedTask(task)}
                            style={{
                              flex: 1,
                              padding: '0.625rem 1rem',
                              backgroundColor: '#f3f4f6',
                              color: '#111827',
                              border: 'none',
                              borderRadius: '0.5rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          >
                            View Details
                          </button>
                          {!isOwnTask && (
                            <button
                              onClick={() => handleApplyTask(task._id)}
                              disabled={applyingTaskId === task._id || isAlreadyApplied}
                              style={{
                                flex: 1,
                                padding: '0.625rem 1rem',
                                backgroundColor: isAlreadyApplied ? '#d1d5db' : '#f8c80a',
                                color: isAlreadyApplied ? '#6b7280' : '#000',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: isAlreadyApplied ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                              }}
                              onMouseEnter={(e) => !isAlreadyApplied && (e.target.style.backgroundColor = '#f0c000')}
                              onMouseLeave={(e) => !isAlreadyApplied && (e.target.style.backgroundColor = '#f8c80a')}
                            >
                              {applyingTaskId === task._id ? (
                                <>
                                  <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} />
                                  Applying...
                                </>
                              ) : isAlreadyApplied ? (
                                '✓ Applied'
                              ) : (
                                'Apply'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onApply={() => handleApplyTask(selectedTask._id)}
          isApplying={applyingTaskId === selectedTask._id}
          isAlreadyApplied={appliedTasks[selectedTask._id]}
          isOwnTask={user._id === selectedTask.postedBy?._id}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .desktop-filters::-webkit-scrollbar { width: 6px; }
        .desktop-filters::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 3px; }
        .desktop-filters::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .desktop-filters::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        @media (max-width: 768px) {
          .desktop-filters { display: none; }
          .mobile-filter-btn { display: flex !important; }
          .mobile-filter-overlay { display: block !important; }
          .task-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1100px) {
          .task-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 1101px) {
          .task-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
