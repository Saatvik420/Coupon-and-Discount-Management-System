import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

// Coupon API calls
export const couponAPI = {
  getActiveCoupons: () => api.get('/coupons/active'),
  getAllCoupons: () => api.get('/coupons'),
  applyCoupon: (data) => {
    const payload = {
      code: data.code,
      orderAmount: parseFloat(data.orderAmount)
    };
    return api.post('/coupons/apply', payload);
  },
  validateCoupon: (code, orderAmount) => {
    const payload = {
      code: code,
      orderAmount: parseFloat(orderAmount)
    };
    return api.post('/coupons/validate', payload);
  },
};

// Admin API calls
export const adminAPI = {
  createCoupon: (couponData) => api.post('/admin/coupons', couponData),
  updateCoupon: (id, couponData) => api.put(`/admin/coupons/${id}`, couponData),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  getAllCoupons: () => api.get('/admin/coupons'),
  getActiveCoupons: () => api.get('/admin/coupons/active'),
  getExpiredCoupons: () => api.get('/admin/coupons/expired'),
  getInactiveCoupons: () => api.get('/admin/coupons/inactive'),
  activateCoupon: (id) => api.put(`/admin/coupons/${id}/activate`),
  deactivateCoupon: (id) => api.put(`/admin/coupons/${id}/deactivate`),
};

export default api;
