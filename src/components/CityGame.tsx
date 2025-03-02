import React, { useState, useEffect } from 'react';
import { useCity } from '../hooks/useCity';
import { CityData } from '../api/cityApi';
import { showConfetti } from '../utils/confettiUtil';

interface CityGameProps {
  onGameComplete?: (score: number) => void;
}

const CityGame: React.FC<CityGameProps> = ({ onGameComplete }) => {
  const { cities, loading, error, generateCityOptions } = useCity();
  const [currentCity, setCurrentCity] = useState<CityData | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [feedback, setFeedback] = useState({
    show: false,
    isCorrect: false,
    message: '',
    funFact: ''
  });
  const [secondChance, setSecondChance] = useState({
    available: false,
    used: false,
    showClue: false
  });
  
  // Select a random city and generate options
  const selectRandomCity = () => {
    if (cities.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * cities.length);
    const selectedCity = cities[randomIndex];
    setCurrentCity(selectedCity);
    
    // Generate 4 options using our hook function
    const cityOptions = generateCityOptions(selectedCity);
    setOptions(cityOptions);
    
    // Reset game state for new question
    setFeedback({
      show: false,
      isCorrect: false,
      message: '',
      funFact: ''
    });
    
    setSecondChance({
      available: false,
      used: false,
      showClue: false
    });
  };
  
  // Handle user's guess
  const handleGuess = (selectedOption: string) => {
    if (!currentCity) return;
    
    const correctAnswer = `${currentCity.city}, ${currentCity.country}`;
    const isCorrect = selectedOption === correctAnswer;
    
    // Get a random fun fact
    const randomFunFact = currentCity.fun_fact[
      Math.floor(Math.random() * currentCity.fun_fact.length)
    ];
    
    if (isCorrect) {
      // Handle correct answer
      setScore(prev => ({
        correct: secondChance.used ? prev.correct + 0.5 : prev.correct + 1,
        incorrect: prev.incorrect
      }));
      
      setFeedback({
        show: true,
        isCorrect: true,
        message: `Correct! ${currentCity.city} is the answer.${
          secondChance.used ? ' You earned 0.5 points for using a second chance.' : ''
        }`,
        funFact: randomFunFact
      });
      
      // Trigger confetti for correct answers
      showConfetti();
    } else {
      // First wrong answer and second chance not yet used
      if (!secondChance.used) {
        setSecondChance(prev => ({
          available: true,
          used: false,
          showClue: false
        }));
      } else {
        // Second chance already used or second wrong answer
        setScore(prev => ({
          correct: prev.correct,
          incorrect: secondChance.used ? prev.incorrect + 0.5 : prev.incorrect + 1
        }));
        
        setFeedback({
          show: true,
          isCorrect: false,
          message: `Sorry! The correct answer is ${currentCity.city}.${
            secondChance.used ? ' You lost 0.5 points for an incorrect second try.' : ''
          }`,
          funFact: randomFunFact
        });
      }
    }
  };
  
  // Handle second chance
  const handleSecondChance = () => {
    setSecondChance(prev => ({
      ...prev,
      used: true,
      showClue: true
    }));
  };
  
  // Skip second chance
  const handleSkipSecondChance = () => {
    if (!currentCity) return;
    
    const randomFunFact = currentCity.fun_fact[
      Math.floor(Math.random() * currentCity.fun_fact.length)
    ];
    
    setScore(prev => ({
      correct: prev.correct,
      incorrect: prev.incorrect + 1
    }));
    
    setFeedback({
      show: true,
      isCorrect: false,
      message: `Sorry! The correct answer is ${currentCity.city}.`,
      funFact: randomFunFact
    });
    
    setSecondChance({
      available: false,
      used: false,
      showClue: false
    });
  };
  
  // Load next question
  const handleNextQuestion = () => {
    selectRandomCity();
  };
  
  // Initialize the game when cities are loaded
  useEffect(() => {
    if (cities.length > 0 && !currentCity) {
      selectRandomCity();
    }
  }, [cities]);
  
  if (loading) {
    return <div>Loading city data...</div>;
  }
  
  if (error) {
    return <div>Error loading cities: {error}</div>;
  }
  
  if (!currentCity) {
    return <div>Preparing game...</div>;
  }
  
  return (
    <div className="city-game">
      <div className="score-display">
        <div>Correct: {score.correct}</div>
        <div>Incorrect: {score.incorrect}</div>
      </div>
      
      <div className="clue-container">
        <h3>Guess the City:</h3>
        {currentCity.clues.map((clue, index) => (
          <p key={index} className="clue">{clue}</p>
        ))}
        
        {secondChance.showClue && currentCity.secondChanceClue && (
          <div className="second-chance-clue">
            <h4>Additional Clue:</h4>
            <p>{currentCity.secondChanceClue}</p>
          </div>
        )}
      </div>
      
      {!feedback.show && !secondChance.available && (
        <div className="options-container">
          {options.map((option, index) => (
            <button 
              key={index}
              className="option-button"
              onClick={() => handleGuess(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      
      {secondChance.available && !secondChance.used && !feedback.show && (
        <div className="second-chance-container">
          <h4>That's not correct! Would you like a second chance?</h4>
          <p>You'll get an additional clue. If you're right, you'll get 0.5 points. If wrong, you'll lose 0.5 points.</p>
          <div>
            <button onClick={handleSecondChance}>
              Yes, show me another clue!
            </button>
            <button onClick={handleSkipSecondChance}>
              No, skip to next question
            </button>
          </div>
        </div>
      )}
      
      {feedback.show && (
        <div className={`feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <h4>{feedback.isCorrect ? 'Correct!' : 'Incorrect'}</h4>
          <p>{feedback.message}</p>
          <div>
            <h5>Fun Fact:</h5>
            <p>{feedback.funFact}</p>
          </div>
          <button onClick={handleNextQuestion}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default CityGame;
