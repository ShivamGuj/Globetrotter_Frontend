import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import Game from './Game';

const Challenge = () => {
  const { username } = useParams();
  const [challengerInfo, setChallengerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getUserByUsername, user, registerUser } = useUser();
  const [newUsername, setNewUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallengerInfo = async () => {
      try {
        const data = await getUserByUsername(username);
        if (data) {
          setChallengerInfo(data);
        } else {
          setError('Challenge not found. The user may have deleted their account.');
        }
      } catch (err) {
        setError('Failed to load challenge information.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallengerInfo();
  }, [username, getUserByUsername]);

  const handleJoinChallenge = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    
    try {
      await registerUser(newUsername.trim());
    } catch (err) {
      setError('Username already taken or registration failed. Please try another username.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-5 sm:p-6 w-full">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full sm:w-auto"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // If user is already registered, show the game
  if (user) {
    return (
      <div className="w-full">
        <div className="bg-indigo-50 p-4 rounded-lg mb-6 w-full">
          <h2 className="text-lg sm:text-xl font-bold mb-2">
            You've accepted {challengerInfo.username}'s challenge!
          </h2>
          <p className="text-gray-700 text-sm sm:text-base">
            Their score: {challengerInfo.score.correct} correct out of{' '}
            {challengerInfo.score.correct + challengerInfo.score.incorrect} questions
          </p>
        </div>
        <Game />
      </div>
    );
  }

  // If user is not registered, show the join form
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-5 sm:p-8 w-full">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
          Challenge Invitation
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-heading">
          {challengerInfo.username}'s Globetrotter Challenge
        </h2>
        
        <div className="mb-5 sm:mb-6">
          <div className="bg-indigo-50 rounded-lg p-4 flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <div className="text-sm text-gray-500">Their Score</div>
              <div className="text-lg sm:text-xl font-bold text-indigo-600">
                {challengerInfo.score.correct} / {challengerInfo.score.correct + challengerInfo.score.incorrect}
              </div>
            </div>
            <div className="text-3xl sm:text-4xl">🏆</div>
          </div>
          
          <p className="text-gray-700 text-sm sm:text-base">
            Can you beat {challengerInfo.username}'s score? Enter a username to start playing!
          </p>
        </div>
        
        <form onSubmit={handleJoinChallenge} className="space-y-4 w-full">
          <div>
            <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">
              Your Username
            </label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your username"
              required
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Accept Challenge
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go Home
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Challenge;