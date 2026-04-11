import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext login called with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('AuthContext received response:', response);
      console.log('Response data:', response.data);
      
      const { token, username, role } = response.data;
      console.log('Extracted data:', { token, username, role });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username, role }));
      
      setUser({ username, role });
      console.log('Login successful, returning success');
      return { success: true };
    } catch (error) {
      // Detailed error logging for debugging
      console.error('Login Error Details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      const errorData = error.response?.data;
      let errorMessage = 'Login failed';
      
      if (errorData) {
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'object') {
          // Extract first field error for validation errors
          const firstError = Object.values(errorData)[0];
          if (firstError) errorMessage = firstError;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.log('Login failed, returning error:', errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      const { token, username, role } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username, role }));
      
      setUser({ username, role });
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = 'Signup failed';
      
      if (errorData) {
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'object') {
          // Extract first field error for validation errors
          const firstError = Object.values(errorData)[0];
          if (firstError) errorMessage = firstError;
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
