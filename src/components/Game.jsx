import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import Confetti from 'react-confetti';
import ShareButton from './ShareButton';

const Game = () => {
  const [destination, setDestination] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user, updateScore } = useUser();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    fetchDestination();
  }, [user, navigate]);

  const fetchDestination = async () => {
    try {
      setLoading(true);
      setShowAnswer(false);
      setIsCorrect(null);
      setSelectedOption(null);
      
      const response = await axios.get(`${API_URL}/api/destinations/random`);
      setDestination(response.data.destination);
      setOptions(response.data.options);
    } catch (error) {
      console.error('Error fetching destination:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (option) => {
    if (showAnswer) return;
    
    setSelectedOption(option);
    const correct = option.id === destination.id;
    setIsCorrect(correct);
    setShowAnswer(true);
    
    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    
    await updateScore(correct);
  };

  const handleNextQuestion = () => {
    fetchDestination();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg overflow-hidden w-full"
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Guess the Destination</h2>
            <div className="text-indigo-600 font-medium">
              Score: {user?.score.correct}/{user?.score.correct + user?.score.incorrect}
            </div>
          </div>
          
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Clues:</h3>
            <ul className="space-y-2 sm:space-y-3">
              {destination?.clues.slice(0, 2).map((clue, index) => (
                <motion.li 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-2 sm:p-3 bg-indigo-50 rounded-md text-gray-700 text-sm sm:text-base"
                >
                  🧩 {clue}
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Select the correct destination:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 sm:p-4 rounded-lg text-left transition text-sm sm:text-base ${
                    selectedOption?.id === option.id
                      ? isCorrect
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-red-100 border-2 border-red-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  disabled={showAnswer}
                >
                  {option.name}, {option.country}
                </motion.button>
              ))}
            </div>
          </div>
          
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 sm:p-6 mb-6 sm:mb-8 rounded-lg ${
                  isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {isCorrect ? "🎉 Correct!" : "😢 Incorrect!"}
                </h3>
                <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                  <span className="font-medium">Fun fact:</span>{" "}
                  {destination.funFacts[Math.floor(Math.random() * destination.funFacts.length)]}
                </p>
                {!isCorrect && (
                  <p className="text-gray-700 text-sm sm:text-base">
                    <span className="font-medium">The correct answer was:</span>{" "}
                    {destination.name}, {destination.country}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handleNextQuestion}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 sm:px-6 rounded-lg transition-colors text-sm sm:text-base order-2 sm:order-1"
            >
              {showAnswer ? "Next Question" : "Skip Question"}
            </button>
            
            <ShareButton username={user?.username} score={user?.score} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Game;
