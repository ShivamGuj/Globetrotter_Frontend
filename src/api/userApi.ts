import axios from "axios";
import { User, UserProfile, UserUpdateData } from "../types/user";
import { getToken } from "../utils/tokenUtils";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://globetrotter-backend-sdio.onrender.com";

// Configure axios with auth token
const authAxios = () => {
  const token = getToken();
  return axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const res = await authAxios().get<UserProfile>(`/users/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return null;
  }
};

export const updateUserProfile = async (userData: UserUpdateData): Promise<User | null> => {
  try {
    const res = await authAxios().put<User>('/users/profile', userData);
    return res.data;
  } catch (err) {
    console.error("Error updating profile:", err);
    return null;
  }
};

export const searchUsers = async (query: string): Promise<User[]> => {
  try {
    const res = await authAxios().get<User[]>(`/users/search?q=${query}`);
    return res.data;
  } catch (err) {
    console.error("Error searching users:", err);
    return [];
  }
};
