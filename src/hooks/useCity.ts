import { useState, useEffect } from 'react';
import { CityData, getGeneratedCities } from '../api/cityApi';
import config from '../config';

export const useCity = () => {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const data = await getGeneratedCities(config.defaultCityCount);
      setCities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching cities'));
      // If mock data is enabled, we might still have cities even after an error
      // If not, we'll have an empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Function to generate 4 options for a city question
  const generateCityOptions = (currentCity: CityData): string[] => {
    if (cities.length < 4) {
      console.error('Not enough cities to generate options');
      // Generate some placeholder options if we don't have enough cities
      return [
        `${currentCity.city}, ${currentCity.country}`,
        'London, UK',
        'New York City, USA',
        'Tokyo, Japan'
      ].sort(() => Math.random() - 0.5);
    }

    // Create the correct answer string
    const correctAnswer = `${currentCity.city}, ${currentCity.country}`;
    
    // Filter out the current city to create wrong answers
    const otherCities = cities.filter(city => 
      `${city.city}, ${city.country}` !== correctAnswer
    );
    
    // Randomly select 3 wrong answers
    const wrongOptions: string[] = [];
    const usedIndices = new Set<number>();
    
    while (wrongOptions.length < 3 && wrongOptions.length < otherCities.length) {
      const randomIndex = Math.floor(Math.random() * otherCities.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const wrongCity = otherCities[randomIndex];
        wrongOptions.push(`${wrongCity.city}, ${wrongCity.country}`);
      }
    }
    
    // Combine correct and wrong options, then shuffle
    const allOptions = [...wrongOptions, correctAnswer];
    return allOptions.sort(() => Math.random() - 0.5);
  };

  return {
    cities,
    loading,
    error,
    refreshCities: fetchCities,
    generateCityOptions
  };
};
