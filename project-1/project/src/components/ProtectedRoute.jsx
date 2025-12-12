import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requireAdmin) {
      // For admin routes, check for adminToken
      const adminToken = localStorage.getItem('adminToken');
      setIsAuthenticated(!!adminToken);
    } else {
      // For user routes, check for authToken
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    }
    setLoading(false);
  }, [requireAdmin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
