import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Signup from './components/Signup';
import CouponList from './components/CouponList';
import ApplyCoupon from './components/ApplyCoupon';
import AdminDashboard from './components/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return user && isAdmin() ? children : <Navigate to="/coupons" />;
};

const AppContent = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Navigation />
              <div className="py-6">
                <CouponList />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/coupons" element={
            <ProtectedRoute>
              <Navigation />
              <div className="py-6">
                <CouponList />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/apply-coupon" element={
            <ProtectedRoute>
              <Navigation />
              <div className="py-6">
                <ApplyCoupon />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <Navigation />
              <div className="py-6">
                <AdminDashboard />
              </div>
            </AdminRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
