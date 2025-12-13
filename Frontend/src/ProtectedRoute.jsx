import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return Boolean(token && user);
  } catch (_) {
    return false;
  }
};

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
