import React, { createContext, useContext, useState, useEffect } from 'react';

interface ScoreContextType {
  score: number;
  updateScore: (newScore: number) => void;
  incrementScore: (amount?: number) => void;
  resetScore: () => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [score, setScore] = useState<number>(0);
  
  // Load score from localStorage on initial render
  useEffect(() => {
    const savedScore = localStorage.getItem('globetrotterScore');
    if (savedScore) {
      setScore(parseInt(savedScore, 10) || 0);
    }
  }, []);
  
  // Save score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('globetrotterScore', score.toString());
    
    // Dispatch a custom event for other components to listen to
    const event = new CustomEvent('scoreUpdated', { detail: { score } });
    window.dispatchEvent(event);
  }, [score]);
  
  // Listen for score updates from Globetrotter game
  useEffect(() => {
    // Function to watch for Globetrotter score updates
    // This should be adapted to how the Globetrotter game updates scores
    const watchGlobetrotterScore = () => {
      const checkScore = () => {
        // Attempt to get score from game state or localStorage
        const gameScore = localStorage.getItem('globetrotterScore');
        if (gameScore) {
          const parsedScore = parseInt(gameScore, 10);
          if (!isNaN(parsedScore) && parsedScore !== score) {
            setScore(parsedScore);
          }
        }
      };
      
      // Check periodically for score updates
      const interval = setInterval(checkScore, 500);
      return () => clearInterval(interval);
    };
    
    const cleanup = watchGlobetrotterScore();
    return cleanup;
  }, [score]);
  
  const updateScore = (newScore: number) => {
    setScore(newScore);
  };
  
  const incrementScore = (amount = 1) => {
    setScore(prevScore => prevScore + amount);
  };
  
  const resetScore = () => {
    setScore(0);
  };
  
  return (
    <ScoreContext.Provider value={{ score, updateScore, incrementScore, resetScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
};
