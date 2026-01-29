import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      
      // Don't show toast for 401 errors (handled by auth redirect)
      if (error.response.status === 401) {
        const { logout } = useAuthStore.getState();
        logout();
        // Redirect handled by ProtectedRoute
      } else if (error.response.status >= 500) {
        toast.error('Server error. Please try again later.');
      }
      // Other errors will be handled by individual components
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export default api;

