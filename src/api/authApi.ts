import axios from "axios";
import { AuthResponse, LoginCredentials, SignupCredentials } from "../types/auth";
import { setToken, removeToken } from "../utils/tokenUtils";
import { mockServices } from "../services/mockDataService";
import config from "../config";

const API_URL = config.apiUrl;

// Helper for simulating API delay with mock data
const withMockDelay = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), config.mockDataDelay);
  });
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
  try {
    const res = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
    const { token, user } = res.data;
    
    // Store token
    setToken(token);
    
    return res.data;
  } catch (err) {
    console.error("Login failed:", err);
    
    // Use mock data if enabled
    if (config.useMockData) {
      console.log("Using mock login data as fallback");
      const mockResponse = mockServices.login();
      setToken(mockResponse.token);
      return withMockDelay(mockResponse);
    }
    
    return null;
  }
};

export const signup = async (credentials: SignupCredentials): Promise<AuthResponse | null> => {
  try {
    const res = await axios.post<AuthResponse>(`${API_URL}/auth/signup`, credentials);
    const { token, user } = res.data;
    
    // Store token
    setToken(token);
    
    return res.data;
  } catch (err) {
    console.error("Signup failed:", err);
    return null;
  }
};

export const logout = (): void => {
  removeToken();
};

export const checkAuthStatus = async (): Promise<AuthResponse | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const res = await axios.get<AuthResponse>(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return res.data;
  } catch (err) {
    console.error("Auth check failed:", err);
    removeToken();
    return null;
  }
};
