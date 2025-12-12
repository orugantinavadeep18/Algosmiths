import React, { useState, useEffect } from 'react';
import { User, Briefcase, CheckCircle, X, Eye, ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import Navbar from '../components/Navbar';

const SuccessModal = ({ onClose, onViewApplications }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '28rem',
      textAlign: 'center',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      animation: 'slideUp 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <CheckCircle size={64} style={{ color: '#22c55e' }} />
      </div>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', margin: '0 0 0.5rem 0' }}>Success!</h2>
      <p style={{ color: '#6b7280', fontSize: '1rem', margin: '0 0 1.5rem 0' }}>Your task has been posted successfully and is now visible to workers.</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            backgroundColor: '#f3f4f6',
            color: '#111827',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Post Another
        </button>
        <button
          onClick={onViewApplications}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            backgroundColor: '#3f5ed9',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Eye size={18} /> View My Tasks
        </button>
      </div>
    </div>
  </div>
);

export default function PostTask() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phone || '',
    taskCategory: '',
    taskType: '',
    taskDescription: '',
    location: '',
    paymentAmount: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        phoneNumber: user.phone || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (submitError) setSubmitError(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    if (!formData.taskCategory) newErrors.taskCategory = 'Please select a category';
    if (!formData.taskType) newErrors.taskType = 'Please select a type';
    if (!formData.taskDescription.trim() || formData.taskDescription.length < 20)
      newErrors.taskDescription = 'Minimum 20 characters required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.paymentAmount || formData.paymentAmount <= 0)
      newErrors.paymentAmount = 'Enter a valid amount';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        taskCategory: formData.taskCategory,
        taskType: formData.taskType,
        taskDescription: formData.taskDescription.trim(),
        location: formData.location.trim(),
        paymentAmount: parseInt(formData.paymentAmount),
        additionalNotes: formData.additionalNotes.trim()
      };

      await taskAPI.createTask(submitData);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        fullName: user?.fullName || '',
        phoneNumber: user?.phone || '',
        taskCategory: '',
        taskType: '',
        taskDescription: '',
        location: '',
        paymentAmount: '',
        additionalNotes: ''
      });
      setErrors({});
    } catch (err) {
      setSubmitError(err.message || 'Failed to post task. Please try again.');
      console.error('Error posting task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Technology', 'Home & Garden', 'Cleaning', 'Delivery', 'Tutoring'];
  const taskTypes = ['One-time', 'Recurring', 'Project-based'];

  if (!user) {
    return (
      <div style={{ backgroundColor: '#fdfaf7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
          <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fdfaf7', minHeight: '100vh' }}>
      <Navbar />

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          onClose={() => {
            setShowSuccess(false);
            window.scrollTo(0, 0);
          }}
          onViewApplications={() => navigate('/accept-task')}
        />
      )}

      {/* Main Content */}
      <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '2rem 1rem', marginTop: '4rem' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#3f5ed9',
            fontWeight: '600',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '2rem'
          }}
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '700', color: '#150b04', margin: 0 }}>Post a Task</h2>
          <p style={{ fontSize: '1.125rem', marginTop: '0.75rem', color: 'rgba(21, 11, 4, 0.7)' }}>
            Fill in your task details and connect with skilled workers
          </p>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '2px solid #fca5a5',
            borderRadius: '1rem',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={24} style={{ color: '#dc2626', flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <h3 style={{ fontWeight: '600', color: '#dc2626', margin: '0 0 0.25rem 0' }}>Error</h3>
              <p style={{ color: '#991b1b', margin: 0, fontSize: '0.875rem' }}>{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '1.5rem', padding: '3rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #d7c3f1', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

          {/* Personal Details Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: 'linear-gradient(135deg, #3f5ed9 0%, #7c3aed 100%)' }}>
                <User style={{ color: 'white', width: '1.75rem', height: '1.75rem' }} />
              </div>
              <h3 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#150b04', margin: 0 }}>Personal Details</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div>
                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem', color: '#374151' }}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: errors.fullName ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    backgroundColor: errors.fullName ? '#fef2f2' : 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => !errors.fullName && (e.target.style.borderColor = '#3f5ed9')}
                  onBlur={(e) => !errors.fullName && (e.target.style.borderColor = '#e5e7eb')}
                />
                {errors.fullName && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>{errors.fullName}</p>}
              </div>

              <div>
                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem', color: '#374151' }}>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: errors.phoneNumber ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    backgroundColor: errors.phoneNumber ? '#fef2f2' : 'white',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => !errors.phoneNumber && (e.target.style.borderColor = '#3f5ed9')}
                  onBlur={(e) => !errors.phoneNumber && (e.target.style.borderColor = '#e5e7eb')}
                />
                {errors.phoneNumber && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>{errors.phoneNumber}</p>}
              </div>
            </div>
          </div>

          {/* Task Details Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', background: 'linear-gradient(135deg, #f8c80a 0%, #fbbf24 100%)' }}>
                <Briefcase style={{ color: '#111827', width: '1.75rem', height: '1.75rem' }} />
              </div>
              <h3 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#150b04', margin: 0 }}>Task Details</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem', color: '#374151' }}>Category *</label>
                <select
                  name="taskCategory"
                  value={formData.taskCategory}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: errors.taskCategory ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    backgroundColor: errors.taskCategory ? '#fef2f2' : 'white',
                    outline: 'none',
                    color: formData.taskCategory ? '#111827' : '#9ca3af',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => !errors.taskCategory && (e.target.style.borderColor = '#3f5ed9')}
                  onBlur={(e) => !errors.taskCategory && (e.target.style.borderColor = '#e5e7eb')}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.taskCategory && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>{errors.taskCategory}</p>}
              </div>

              <div>
                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem', color: '#374151' }}>Task Type *</label>
                <select
                  name="taskType"
                  value={formData.taskType}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: errors.taskType ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    backgroundColor: errors.taskType ? '#fef2f2' : 'white',
                    outline: 'none',
                    color: formData.taskType ? '#111827' : '#9ca3af',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => !errors.taskType && (e.target.style.borderColor = '#3f5ed9')}
                  onBlur={(e) => !errors.taskType && (e.target.style.borderColor = '#e5e7eb')}
                >
                  <option value="" disabled>Select type</option>
                  {taskTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors.taskType && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>{errors.taskType}</p>}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem', color: '#374151' }}>Description *</label>
              <textarea
                name="taskDescription"
                rows="5"
                placeholder="Describe your task clearly. Minimum 20 characters..."
                value={formData.taskDescription}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  border: errors.taskDescription ? '2px solid #ef4444' : '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  backgroundColor: errors.taskDescription ? '#fef2f2' : 'white',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  minHeight: '8rem'
                }}
                onFocus={(e) => !errors.taskDescription && (e.target.style.borderColor = '#3f5ed9')}
                onBlur={(e) => !errors.taskDescription && (e.target.style.borderColor = '#e5e7eb')}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <p style={{ color: '#dc2626', fontSize: '0.75rem', margin: 0 }}>{errors.taskDescription || ''}</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{formData.taskDescription.length}/500</p>
              </div>
            </div>

            <div>
              <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem', color: '#374151' }}>Location *</label>
              <input
                name="location"
                placeholder="Enter task location (city, area, etc.)"
                value={formData.location}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  border: errors.location ? '2px solid #ef4444' : '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  backgroundColor: errors.location ? '#fef2f2' : 'white',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => !errors.location && (e.target.style.borderColor = '#3f5ed9')}
                onBlur={(e) => !errors.location && (e.target.style.borderColor = '#e5e7eb')}
              />
              {errors.location && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>{errors.location}</p>}
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem', color: '#374151' }}>Payment Amount (₹) *</label>
            <input
              type="number"
              name="paymentAmount"
              placeholder="Enter payment amount"
              value={formData.paymentAmount}
              onChange={handleInputChange}
              min="1"
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                border: errors.paymentAmount ? '2px solid #ef4444' : '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                backgroundColor: errors.paymentAmount ? '#fef2f2' : 'white',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => !errors.paymentAmount && (e.target.style.borderColor = '#3f5ed9')}
              onBlur={(e) => !errors.paymentAmount && (e.target.style.borderColor = '#e5e7eb')}
            />
            {errors.paymentAmount && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>{errors.paymentAmount}</p>}
          </div>

          {/* Additional Notes */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.875rem', color: '#374151' }}>Additional Notes (Optional)</label>
            <textarea
              name="additionalNotes"
              rows="3"
              placeholder="Any extra instructions or requirements..."
              value={formData.additionalNotes}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                backgroundColor: 'white',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                minHeight: '6rem'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3f5ed9')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          {/* Admin Policy Disclaimer */}
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #fcd34d',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '50%',
              backgroundColor: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              flexShrink: 0,
              fontSize: '0.875rem'
            }}>
              ⚠️
            </div>
            <div>
              <h4 style={{ fontWeight: '700', color: '#92400e', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Admin Task Management Policy</h4>
              <p style={{ color: '#b45309', margin: '0.5rem 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
                <strong>Auto-Deletion:</strong> If the task deadline is reached and no one has applied, the admin system will automatically delete this task to keep the platform clean and organized.
              </p>
              <p style={{ color: '#b45309', margin: '0.5rem 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
                <strong>Admin Oversight:</strong> Admins can also manually manage tasks based on activity and platform policies.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              color: 'white',
              fontWeight: '700',
              padding: '1.25rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '1.125rem',
              transition: 'all 0.3s',
              boxShadow: isSubmitting ? 'none' : '0 10px 15px -3px rgba(63, 94, 217, 0.3)',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #3f5ed9 0%, #7c3aed 100%)',
              opacity: isSubmitting ? 0.8 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Posting Task...
              </>
            ) : (
              <>
                <Briefcase size={20} />
                Post Task Now
              </>
            )}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '2.5rem 1rem', textAlign: 'center', marginTop: '4rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>TaskFlow © 2025. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          main { padding: 1rem 0.5rem !important; margin-top: 5rem !important; }
          h2 { font-size: 2rem !important; }
          h3 { font-size: 1.5rem !important; }
          form { padding: 1.5rem !important; gap: 1.5rem !important; }
          div > div { gap: 1rem !important; }
        }
        @media (max-width: 480px) {
          h2 { font-size: 1.5rem !important; }
          h3 { font-size: 1.25rem !important; }
          form { padding: 1rem !important; gap: 1rem !important; }
          button { font-size: 1rem !important; padding: 0.875rem !important; }
          input, select, textarea { font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
}
