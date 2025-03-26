import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedOut = localStorage.getItem('isLoggedOut') === 'true';
  
  // Check if user is authenticated and not logged out
  if (!token || isLoggedOut) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // If allowedRoles is provided and not empty, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin' || user.role === 'manager') {
      return <Navigate to="/manager" replace />;
    } else {
      return <Navigate to="/employee" replace />;
    }
  }
  
  // If authenticated and has proper role, render the protected component
  return element;
};

export default ProtectedRoute;