const config = {
  // API base URL for backend requests
  apiBaseUrl: 'http://localhost:3001',
  // API URL (for any legacy code)
  apiUrl: 'http://localhost:3001',
  // Enable to use mock data when API fails
  useMockData: true,
  // Delay in ms to simulate API response time when using mock data
  mockDataDelay: 800,
  // Storage key for authentication token
  tokenKey: 'globetrotter_auth_token',
  // Enable debug mode for additional console logging
  debug: true,
  // Number of cities to request from the API
  defaultCityCount: 20
};

export default config;
