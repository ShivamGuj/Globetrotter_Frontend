import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('globetrotter_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const registerUser = async (username) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/users`, { username });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('globetrotter_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateScore = async (correct) => {
    if (!user) return;
    
    try {
      const updatedUser = {
        ...user,
        score: {
          correct: user.score.correct + (correct ? 1 : 0),
          incorrect: user.score.incorrect + (correct ? 0 : 1)
        }
      };
      
      await axios.put(`${API_URL}/api/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      localStorage.setItem('globetrotter_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const getUserByUsername = async (username) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/username/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    registerUser,
    updateScore,
    getUserByUsername
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
