import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvitation, Invitation } from '../services/invitation.service';
import { v4 as uuidv4 } from 'uuid';
import GlobetrotterGame from '../pages/Game';

const InvitationHandler: React.FC = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const navigate = useNavigate();
  
  // States
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentScore, setCurrentScore] = useState<number>(0); 
  
  // Use a ref for polling to avoid stale closures
  const scoreRef = useRef<number>(0);
  
  // Initialize player data and fetch invitation
  useEffect(() => {
    // Setup player info
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerName(storedName);
    } else {
      const defaultName = `Player${Math.floor(Math.random() * 1000)}`;
      setPlayerName(defaultName);
      localStorage.setItem('playerName', defaultName);
    }

    const storedId = localStorage.getItem('playerId');
    if (!storedId) {
      localStorage.setItem('playerId', uuidv4());
    }
    
    // Load initial score
    const storedScore = localStorage.getItem('globetrotterScore');
    if (storedScore) {
      const initialScore = parseFloat(storedScore);
      if (!isNaN(initialScore)) {
        setCurrentScore(initialScore);
        scoreRef.current = initialScore;
      }
    }
    
    // Fetch invitation data
    const fetchInvitation = async () => {
      try {
        if (invitationId) {
          const data = await getInvitation(invitationId);
          setInvitation(data);
        }
      } catch (err) {
        setError('This invitation is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [invitationId]);

  // Function to update score
  const handleScoreUpdate = useCallback((newScore: number) => {
    setCurrentScore(newScore);
    scoreRef.current = newScore;
    console.log('Score updated to:', newScore); // Debug log
  }, []);

  // Track score changes with multiple methods to ensure we catch all updates
  useEffect(() => {
    // Method 1: Listen for custom score update event
    const handleScoreUpdateEvent = (e: CustomEvent) => {
      if (e.detail && typeof e.detail.score === 'number') {
        const newScore = e.detail.score;
        console.log('Score event received:', newScore); // Debug log
        handleScoreUpdate(newScore);
      }
    };
    
    // Method 2: Poll localStorage for changes
    const checkLocalStorage = () => {
      const storedScore = localStorage.getItem('globetrotterScore');
      if (storedScore) {
        const parsedScore = parseFloat(storedScore);
        if (!isNaN(parsedScore) && Math.abs(parsedScore - scoreRef.current) > 0.01) {
          console.log('Score change detected in localStorage:', parsedScore, 'Previous:', scoreRef.current); // Debug log
          handleScoreUpdate(parsedScore);
        }
      }
    };
    
    // Setup event listeners
    window.addEventListener('scoreUpdated', handleScoreUpdateEvent as EventListener);
    window.addEventListener('globetrotterScoreUpdate', handleScoreUpdateEvent as EventListener);
    
    // Setup polling interval (more frequent for better responsiveness)
    const interval = setInterval(checkLocalStorage, 300);
    
    // Cleanup
    return () => {
      window.removeEventListener('scoreUpdated', handleScoreUpdateEvent as EventListener);
      window.removeEventListener('globetrotterScoreUpdate', handleScoreUpdateEvent as EventListener);
      clearInterval(interval);
    };
  }, [handleScoreUpdate]);

  // Directly update game score from parent component
  const updateGameScore = useCallback((newScore: number) => {
    // This is a prop function we'll pass to the Game component
    handleScoreUpdate(newScore);
    localStorage.setItem('globetrotterScore', newScore.toString());
    
    // Dispatch events for other components
    const updateEvent = new CustomEvent('scoreUpdated', { 
      detail: { score: newScore } 
    });
    window.dispatchEvent(updateEvent);
  }, [handleScoreUpdate]);

  // Function to start the game
  const startGame = () => {
    // Reset score when starting a new challenge
    localStorage.setItem('globetrotterScore', '0');
    handleScoreUpdate(0);
    setGameStarted(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading challenge...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-lg shadow text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Challenge Not Found</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <a 
          href="/" 
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Home
        </a>
      </div>
    );
  }

  // Initial invitation view (before starting the game)
  if (invitation && !gameStarted) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Challenge Invitation</h1>
            <p className="text-gray-600 mt-2">
              You've been challenged by <span className="font-medium">{invitation.inviterName}</span>!
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg text-center mb-8">
            <p className="text-gray-700 mb-2">Can you beat their score?</p>
            <div className="bg-blue-500 text-white text-3xl font-bold w-24 h-24 rounded-full flex items-center justify-center mx-auto my-4 shadow-md">
              {invitation.score}
            </div>
            <p className="text-sm text-gray-500">Playing as: {playerName}</p>
          </div>
          
          <button
            onClick={startGame}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md shadow transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Play to Beat
          </button>
        </div>
      </div>
    );
  }

  // Game view (after pressing "Play to Beat")
  return (
    <div className="max-w-4xl mx-auto">
      {invitation && (
        <div className="bg-blue-50 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h2 className="text-lg font-bold mb-2 sm:mb-0">
              Beat {invitation.inviterName}'s Score: {invitation.score}
            </h2>
            
            <div className="flex items-center">
              <div className="mr-2 text-sm">Your score:</div>
              <div className="bg-white px-3 py-1 rounded-full font-bold">
                {currentScore.toFixed(1)}
              </div>
              <div className="ml-4 text-sm">
                {currentScore > invitation.score ? (
                  <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Challenge beaten!
                  </span>
                ) : (
                  <span className="text-gray-500">
                    {(invitation.score - currentScore).toFixed(1)} more to win
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${currentScore > invitation.score ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ 
                  width: `${Math.min(Math.max((currentScore / (invitation.score || 1)) * 100, 5), 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Display current score (removed test controls) */}
      <div className="bg-gray-100 p-2 rounded text-lg mb-4 flex">
        <span>Current score: {currentScore.toFixed(1)}</span>
      </div>
      
      {/* Render the modified Globetrotter game component with onScoreChange prop */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <GlobetrotterGameWrapper 
          key={`game-${gameStarted}-${invitationId}`} 
          onScoreChange={updateGameScore} 
          initialScore={currentScore}
        />
      </div>
    </div>
  );
};

// Wrapper component to pass props to the Globetrotter game
const GlobetrotterGameWrapper: React.FC<{ 
  onScoreChange: (score: number) => void;
  initialScore: number;
}> = ({ onScoreChange, initialScore }) => {
  // Hijack the scoreUpdated event to directly update our parent
  useEffect(() => {
    const handleGameScoreChange = (e: CustomEvent) => {
      if (e.detail && typeof e.detail.score === 'number') {
        onScoreChange(e.detail.score);
      }
    };
    
    window.addEventListener('globetrotterScoreUpdate', handleGameScoreChange as EventListener);
    
    return () => {
      window.removeEventListener('globetrotterScoreUpdate', handleGameScoreChange as EventListener);
    };
  }, [onScoreChange]);

  return <GlobetrotterGame />;
};

export default InvitationHandler;
