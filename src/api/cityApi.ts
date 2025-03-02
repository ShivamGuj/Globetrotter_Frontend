import api from './axiosConfig';
import { mockServices } from '../services/mockDataService';
import config from '../config';

export interface CityData {
  id: string;
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  secondChanceClue?: string;
}

// Helper for simulating API delay with mock data
const withMockDelay = <T>(data: T): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), config.mockDataDelay);
  });
};

export const getGeneratedCities = async (count: number = config.defaultCityCount): Promise<CityData[]> => {
  try {
    const res = await api.get<CityData[]>(`/cities/generate/${count}`);
    return res.data;
  } catch (err) {
    console.error('Error generating cities:', err);
    
    // Use mock data if enabled
    if (config.useMockData) {
      console.log('Using mock city data as fallback');
      return withMockDelay(mockServices.getGeneratedCities(count));
    }
    
    throw err;
  }
};

export const getCityById = async (id: string): Promise<CityData | null> => {
  try {
    const res = await api.get<CityData>(`/cities/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching city:', err);
    
    // Use mock data if enabled
    if (config.useMockData) {
      console.log('Using mock city data as fallback');
      const mockCities = mockServices.getGeneratedCities();
      const city = mockCities.find(c => c.id === id) || mockCities[0];
      return withMockDelay(city);
    }
    
    return null;
  }
};

export default {
  getGeneratedCities,
  getCityById
};
