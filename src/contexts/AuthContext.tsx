import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id?: number;
  userId?: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  getAuthHeader: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://globetrotter-backend-sdio.onrender.com";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        // Only parse if savedUser is not null or undefined
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // If there's an error parsing the user, clear the invalid data
        console.error('Error parsing stored user data:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Configure axios for CORS
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: false // Change to true only if your backend supports credentials
      });
      
      const { access_token, userId, username: responseUsername } = response.data;
      
      // Create a user object from the response
      const userData = {
        userId: userId,
        id: userId, // Set id to userId for compatibility
        username: responseUsername
      };
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      // Detailed error logging
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received. CORS or network issue likely.');
        }
      }
      
      return { 
        success: false, 
        message: axios.isAxiosError(error) && error.response?.data?.message 
          ? error.response.data.message 
          : 'Login failed. Please check your connection and try again.'
      };
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });
      
      // If registration returns user data, we can log the user in immediately
      if (response.data.access_token) {
        const { access_token, userId, username: responseUsername } = response.data;
        
        const userData = {
          userId: userId,
          id: userId,
          username: responseUsername
        };
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Username may already be taken'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
