import axios from "axios";
import { Invite } from "../types/invite";
import { mockServices } from "../services/mockDataService";
import config from "../config";
import api from './axiosConfig';

// Helper for simulating API delay with mock data
const withMockDelay = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), config.mockDataDelay);
  });
};

export const createInvite = async (username: string): Promise<Invite | null> => {
  try {
    const res = await api.post<Invite>(`/invite/create`, { username });
    return res.data;
  } catch (err) {
    console.error("Error creating invite:", err);
    
    // Use mock data if enabled
    if (config.useMockData) {
      console.log("Using mock invite data as fallback");
      return withMockDelay(mockServices.createInvite());
    }
    
    return null;
  }
};
