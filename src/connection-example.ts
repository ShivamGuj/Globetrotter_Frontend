// This is an example of how to fetch cities from your backend
async function fetchCities(count: number = 100) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/cities?count=${count}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    const cities = await response.json();
    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}

// Example usage in your game.tsx
// import { fetchCities } from './connection-example';
//
// useEffect(() => {
//   async function loadCities() {
//     try {
//       const cityData = await fetchCities(10); // Get 10 cities
//       // Use cityData in your game state
//       setCities(cityData);
//     } catch (error) {
//       console.error('Failed to load cities:', error);
//     }
//   }
//   loadCities();
// }, []);
