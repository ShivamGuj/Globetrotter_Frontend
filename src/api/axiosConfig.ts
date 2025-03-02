import axios from 'axios';
import config from '../config';

// Create an axios instance with common configuration
const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  requestConfig => {
    // Get token from localStorage
    const token = localStorage.getItem(config.tokenKey);
    
    // If token exists, add to authorization header
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in debug mode
    if (config.debug) {
      console.log('API Request:', requestConfig.method?.toUpperCase(), requestConfig.url);
    }
    
    return requestConfig;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    // Log responses in debug mode
    if (config.debug) {
      console.log('API Response:', response.status, response.config.url);
    }
    
    return response;
  },
  error => {
    if (config.debug) {
      console.error('API Error:', error.response?.status, error.response?.data);
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Redirect to login or clear token
    }
    
    return Promise.reject(error);
  }
);

export default api;
