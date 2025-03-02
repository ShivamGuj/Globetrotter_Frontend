import api from './axiosConfig';
import { Game } from "../types/game";
import { mockServices } from "../services/mockDataService";
import config from "../config";

// Helper for simulating API delay with mock data
const withMockDelay = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), config.mockDataDelay);
  });
};

export const getRandomGame = async (): Promise<Game | null> => {
  try {
    const res = await api.get<Game>('/games/random');
    return res.data;
  } catch (err) {
    console.error("Error fetching game:", err);
    
    // Use mock data if enabled
    if (config.useMockData) {
      console.log("Using mock game data as fallback");
      return withMockDelay(mockServices.getRandomGame());
    }
    
    return null;
  }
};

export const getFeaturedGames = async (): Promise<Game[]> => {
  try {
    const res = await api.get<Game[]>('/games/featured');
    return res.data;
  } catch (err) {
    console.error("Error fetching featured games:", err);
    
    // Use mock data if enabled
    if (config.useMockData) {
      console.log("Using mock featured games data as fallback");
      return withMockDelay(mockServices.getFeaturedGames());
    }
    
    return [];
  }
};

export const getGameById = async (gameId: string): Promise<Game | null> => {
  try {
    const res = await api.get<Game>(`/games/${gameId}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching game ${gameId}:`, err);
    
    // Use mock data if enabled
    if (config.useMockData) {
      console.log(`Using mock data for game ${gameId} as fallback`);
      return withMockDelay(mockServices.getGameById(gameId));
    }
    
    return null;
  }
};

export default {
  getRandomGame,
  getFeaturedGames,
  getGameById
};
