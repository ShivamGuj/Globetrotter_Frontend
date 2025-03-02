import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { motion } from 'framer-motion';

const Welcome = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { user, registerUser, loading } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    try {
      await registerUser(username.trim());
      navigate('/game');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('Username already taken. Please choose another.');
      } else {
        setError('Failed to register. Please try again.');
      }
    }
  };

  // If user already exists, redirect to game
  if (user && !loading) {
    navigate('/game');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden my-4 sm:my-10"
    >
      <div className="w-full p-5 sm:p-8">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1"
        >
          Welcome to
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 font-heading">Globetrotter</h1>
        <p className="text-gray-600 mb-4 sm:mb-6">
          Test your geography knowledge with cryptic clues about famous destinations around the world!
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
              Enter a username to start:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="YourUsername"
              disabled={loading}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {loading ? 'Loading...' : 'Start Playing'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default Welcome;
