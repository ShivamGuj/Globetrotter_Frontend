import React, { useState, useEffect } from 'react';
import { showConfetti } from '../utils/confettiUtil';
import { useCity } from '../hooks/useCity';
import { CityData } from '../api/cityApi';

// Define types
interface Destination {
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
  secondChanceClue?: string; // New property for second chance clue
}

interface SecondChance {
  available: boolean;
  used: boolean;
  showClue: boolean;
}

interface Feedback {
  show: boolean;
  isCorrect: boolean;
  message: string;
  funFact: string;
}

interface GameState {
  score: {
    correct: number;
    incorrect: number;
  };
  totalScore: number; // New property for total score
  feedback: Feedback;
  showOptions: boolean;
  gameCompleted: boolean;
  secondChance: SecondChance;
  firstTimePlayer: boolean;
  showInstructions: boolean;
} 

// Styles
const styles = {
  gameContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  gameHeader: {
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  gameTitle: {
    fontSize: '2.5rem',
    color: '#2c3e50',
  },
  totalScore: {
    textAlign: 'center' as const,
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    color: '#2c3e50',
    margin: '10px 0',
    padding: '8px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    display: 'inline-block',
  },
  clueContainer: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  clue: {
    fontSize: '1.2rem',
    marginBottom: '10px',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  optionButton: {
    padding: '15px',
    fontSize: '1rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9',
    }
  },
  feedbackContainer: {
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  feedbackCorrect: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  feedbackIncorrect: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  scoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginTop: '20px',
  },
  scoreItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: '2rem',
    fontWeight: 'bold' as const,
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
    backgroundColor: '#3498db',
    color: 'white',
  },
  secondChanceButton: {
    backgroundColor: '#2ecc71',
  },
  skipButton: {
    backgroundColor: '#e74c3c',
  },
  challengeButton: {
    backgroundColor: '#9b59b6',
  },
  secondChanceContainer: {
    textAlign: 'center' as const,
    margin: '20px 0',
    padding: '20px',
    backgroundColor: '#fff3cd',
    borderRadius: '10px',
  },
  secondChanceClue: {
    padding: '10px',
    backgroundColor: '#e8f4f8',
    borderLeft: '4px solid #3498db',
    marginTop: '15px',
  },
  loadingText: {
    fontSize: '1.5rem',
    textAlign: 'center' as const,
    margin: '50px 0',
  },
  instructionsModal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  instructionsContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  instructionsTitle: {
    textAlign: 'center' as const,
    color: '#2c3e50',
  },
  instructionsList: {
    margin: '20px 0',
  },
  instructionsButton: {
    display: 'block',
    width: '200px',
    padding: '12px 20px',
    margin: '0 auto',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
  }
};

const Game: React.FC = () => {
  const { cities, loading: citiesLoading, error, generateCityOptions } = useCity();
  
  const [currentDestination, setCurrentDestination] = useState<CityData | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameState, setGameState] = useState<GameState>({
    score: {
      correct: 0,
      incorrect: 0,
    },
    totalScore: 0, // Initialize total score
    feedback: {
      show: false,
      isCorrect: false,
      message: '',
      funFact: '',
    },
    showOptions: true,
    gameCompleted: false,
    secondChance: {
      available: false,
      used: false,
      showClue: false,
    },
    firstTimePlayer: true, 
    showInstructions: true,
  });

  // Function to select a random destination and generate options
  const selectRandomDestination = () => {
    if (cities.length === 0) {
      console.error('No cities data returned from API');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * cities.length);
    const selected = cities[randomIndex];
    setCurrentDestination(selected);
    
    // Generate 4 options using our hook function
    const cityOptions = generateCityOptions(selected);
    setOptions(cityOptions);
    
    // Reset game state for new question
    setGameState(prev => ({
      ...prev,
      feedback: {
        show: false,
        isCorrect: false,
        message: '',
        funFact: '',
      },
      showOptions: true,
      secondChance: {
        available: false,
        used: false,
        showClue: false,
      }
    }));
  };
 
  // Function to handle user's guess
  const handleGuess = (selectedOption: string) => {
    if (!currentDestination) return;
    
    const correctAnswer = `${currentDestination.city}, ${currentDestination.country}`;
    const isCorrect = selectedOption === correctAnswer;
    
    // Get a random fun fact
    const randomFunFact = currentDestination.fun_fact[Math.floor(Math.random() * currentDestination.fun_fact.length)];
    
    if (isCorrect) {
      // Handle correct answer
      setGameState(prev => {
        // Calculate score change based on whether second chance was used
        const scoreChange = prev.secondChance.used ? 0.5 : 1;
        const newTotalScore = prev.totalScore + scoreChange;
        
        // Broadcast score update immediately - important for responsiveness
        const updateEvent = new CustomEvent('globetrotterScoreUpdate', { 
          detail: { score: newTotalScore } 
        });
        window.dispatchEvent(updateEvent);
        localStorage.setItem('globetrotterScore', newTotalScore.toString());
        
        return {
          ...prev,
          score: {
            correct: prev.score.correct + 1, // Always increment by 1 for stats
            incorrect: prev.score.incorrect,
          },
          totalScore: newTotalScore, // Add to total score
          feedback: {
            show: true,
            isCorrect: true,
            message: `Correct! ${currentDestination.city} is the answer.${prev.secondChance.used ? ' You earned 0.5 points for using a second chance.' : ''}`,
            funFact: randomFunFact,
          },
          showOptions: false,
        };
      });
      
      // Trigger confetti for correct answers
      showConfetti();
    } else {
      // First wrong answer and second chance not yet used
      if (!gameState.secondChance.used) {
        setGameState(prev => ({
          ...prev,
          secondChance: {
            available: true,
            used: false,
            showClue: false,
          },
          showOptions: false,
        }));
      } else {
        // Second chance already used or second wrong answer
        setGameState(prev => {
          const newTotalScore = prev.totalScore - 0.5;
          
          // Broadcast the score update immediately for faster UI feedback
          localStorage.setItem('globetrotterScore', newTotalScore.toString());
          const updateEvent = new CustomEvent('scoreUpdated', { 
            detail: { score: newTotalScore } 
          });
          window.dispatchEvent(updateEvent);
          
          return {
            ...prev,
            score: {
              correct: prev.score.correct,
              incorrect: prev.score.incorrect + 1, // Always increment by 1 for stats
            },
            totalScore: newTotalScore, // Deduct 0.5 points for incorrect second try
            feedback: {
              show: true,
              isCorrect: false,
              message: `Sorry! The correct answer is ${currentDestination.city}.${prev.secondChance.used ? ' You lost 0.5 points for an incorrect second try.' : ''}`,
              funFact: randomFunFact,
            },
            showOptions: false,
          };
        });
      }
    }
  };

  // Function to handle second chance
  const handleSecondChance = () => {
    setGameState(prev => ({
      ...prev,
      secondChance: {
        ...prev.secondChance,
        used: true,
        showClue: true,
      },
      showOptions: true,
    }));
  };

  // Function to skip second chance
  const handleSkipSecondChance = () => {
    if (!currentDestination) return;
    
    const randomFunFact = currentDestination.fun_fact[Math.floor(Math.random() * currentDestination.fun_fact.length)];
    
    setGameState(prev => ({
      ...prev,
      score: {
        correct: prev.score.correct,
        incorrect: prev.score.incorrect + 1, // Increment incorrect count by 1
      },
      // No change to total score when skipping (incorrect first try)
      feedback: {
        show: true,
        isCorrect: false,
        message: `Sorry! The correct answer is ${currentDestination.city}.`,
        funFact: randomFunFact,
      },
      secondChance: {
        ...prev.secondChance,
        available: false,
      },
      showOptions: false,
    }));
  };

  // Function to load next question
  const handleNextQuestion = () => {
    selectRandomDestination();
  };

  // Function to handle challenge a friend
  const handleChallengeAFriend = () => {
    // This would typically open a modal for username input and create sharing link
    alert("Challenge a Friend feature would open here!");
    // Implementation could include:
    // 1. Check if user is registered, if not prompt for username
    // 2. Generate a shareable link with user info
    // 3. Create a share modal with WhatsApp sharing option
  };

  // Function to close instructions
  const closeInstructions = () => {
    setGameState(prev => ({
      ...prev,
      showInstructions: false,
    }));
    
    // Could save to localStorage to remember the user has seen instructions
    localStorage.setItem('globetrotterInstructionsViewed', 'true');
  };

  // Initialize game
  useEffect(() => {
    // Check if player has seen instructions before
    const instructionsViewed = localStorage.getItem('globetrotterInstructionsViewed');
    if (instructionsViewed === 'true') {
      setGameState(prev => ({
        ...prev,
        firstTimePlayer: false,
        showInstructions: false
      }));
    }
  }, []);

  useEffect(() => {
    setLoading(citiesLoading);
  }, [citiesLoading]);

  useEffect(() => {
    if (cities.length > 0 && !currentDestination) {
      selectRandomDestination();
    }
  }, [cities]);

  useEffect(() => {
    // This function will broadcast the score to all interested components
    const broadcastScore = (score: number) => {
      // Update localStorage - use fixed precision to avoid float issues
      localStorage.setItem('globetrotterScore', score.toString());
      
      console.log('Broadcasting score update:', score); // Debug log
      
      // Dispatch both events synchronously to ensure they're received
      // Main event
      const updateEvent = new CustomEvent('scoreUpdated', { 
        detail: { score } 
      });
      window.dispatchEvent(updateEvent);
      
      // Game-specific event
      const gameEvent = new CustomEvent('globetrotterScoreUpdate', { 
        detail: { score } 
      });
      window.dispatchEvent(gameEvent);
    };
    
    // When totalScore changes, broadcast the change
    broadcastScore(gameState.totalScore);
    
  }, [gameState.totalScore]);

  if (loading) {
    return <div style={styles.loadingText}>Loading destinations...</div>;
  }

  if (!currentDestination) {
    return <div style={styles.loadingText}>Preparing game...</div>;
  }

  return (
    <div style={styles.gameContainer}>
      {gameState.showInstructions && (
        <div style={styles.instructionsModal}>
          <div style={styles.instructionsContent}>
            <h2 style={styles.instructionsTitle}>Welcome to Globetrotter!</h2>
            <div style={styles.instructionsList}>
              <p>Here's how to play:</p>
              <ol>
                <li>You'll be shown clues about a city around the world.</li>
                <li>Try to guess which city it is from the options provided.</li>
                <li>If your guess is correct, you'll earn 1 point.</li>
                <li><strong>New Feature - Second Chance:</strong> If your first guess is wrong, you'll have an opportunity for a second chance!</li>
                <li>You can view an additional clue and try again.</li>
                <li>A correct second guess earns you 0.5 points.</li>
                <li>An incorrect second guess costs you 0.5 points.</li>
              </ol>
              <p>Let's see how well you know the world!</p>
            </div>
            <button style={styles.instructionsButton} onClick={closeInstructions}>
              Let's Play!
            </button>
          </div>
        </div>
      )}
      
      <div style={styles.gameHeader}>
        <h1 style={styles.gameTitle}>Globetrotter</h1>
        <p>Guess the destination based on the clues below!</p>
        <div style={styles.totalScore}>
          Total Score: {gameState.totalScore.toFixed(1)}
        </div>
      </div>
      
      <div style={styles.clueContainer}>
        <h2>Clues:</h2>
        {currentDestination.clues.map((clue, index) => (
          <p key={index} style={styles.clue}>{clue}</p>
        ))}
        
        {gameState.secondChance.showClue && currentDestination.secondChanceClue && (
          <div style={styles.secondChanceClue}>
            <h3>Additional Clue:</h3>
            <p>{currentDestination.secondChanceClue}</p>
          </div>
        )}
      </div>
      
      {gameState.showOptions && (
        <div>
          <h3>Where am I?</h3>
          <div style={styles.optionsGrid}>
            {options.map((option, index) => (
              <button 
                key={index} 
                style={styles.optionButton}
                onClick={() => handleGuess(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {gameState.secondChance.available && !gameState.secondChance.used && (
        <div style={styles.secondChanceContainer}>
          <h3>That's not correct! Would you like a second chance?</h3>
          <p>You'll get an additional clue. If you're right, you'll get 0.5 points. If wrong, you'll lose 0.5 points.</p>
          <div style={{marginTop: '1rem'}}>
            <button 
              style={{...styles.button, ...styles.secondChanceButton}}
              onClick={handleSecondChance}
            >
              Yes, show me another clue!
            </button>
            <button 
              style={{...styles.button, ...styles.skipButton}}
              onClick={handleSkipSecondChance}
            >
              No, skip to next question
            </button>
          </div>
        </div>
      )}
      
      {gameState.feedback.show && (
        <div 
          style={{
            ...styles.feedbackContainer, 
            ...(gameState.feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect)
          }}
        >
          <h3>{gameState.feedback.isCorrect ? '🎉 Correct!' : '😢 Incorrect'}</h3>
          <p>{gameState.feedback.message}</p>
          <div>
            <h4>Fun Fact:</h4>
            <p>{gameState.feedback.funFact}</p>
          </div>
          <button 
            style={styles.button}
            onClick={handleNextQuestion}
          >
            Next Destination
          </button>
          <button 
            style={{...styles.button, ...styles.challengeButton}}
            onClick={handleChallengeAFriend}
          >
            Challenge a Friend
          </button>
        </div>
      )}
      
      <div style={styles.scoreContainer}>
        <div style={styles.scoreItem}>
          <span style={styles.scoreValue}>{gameState.score.correct}</span>
          <span>Correct</span>
        </div>
        <div style={styles.scoreItem}>
          <span style={styles.scoreValue}>{gameState.score.incorrect}</span>
          <span>Incorrect</span>
        </div>
      </div>
    </div>
  );
};

export default Game;
