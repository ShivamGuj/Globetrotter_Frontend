import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import InviteFriendModal from './InviteFriendModal';
import { useScore } from '../contexts/ScoreContext';

interface GameProps {
  inviterScore?: number;
  challengerName?: string;
}

const Game: React.FC<GameProps> = ({ inviterScore, challengerName }) => {
  const { score } = useScore();
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasBeatenChallenge, setHasBeatenChallenge] = useState(false);
  
  // Initialize player data
  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    const storedId = localStorage.getItem('playerId');
    
    if (storedName) {
      setPlayerName(storedName);
    } else {
      const defaultName = `Player${Math.floor(Math.random() * 1000)}`;
      setPlayerName(defaultName);
      localStorage.setItem('playerName', defaultName);
    }
    
    if (storedId) {
      setPlayerId(storedId);
    } else {
      const newId = uuidv4();
      setPlayerId(newId);
      localStorage.setItem('playerId', newId);
    }
    
    // Check if this challenge was already beaten
    if (challengerName && inviterScore) {
      const challengeKey = `beat_challenge_${challengerName}_${inviterScore}`;
      const alreadyBeaten = localStorage.getItem(challengeKey) === 'true';
      setHasBeatenChallenge(alreadyBeaten);
    }
  }, [challengerName, inviterScore]);

  // Check if user just beat the challenge and show confetti
  useEffect(() => {
    if (inviterScore && challengerName && score > inviterScore && !hasBeatenChallenge) {
      setShowConfetti(true);
      setHasBeatenChallenge(true);
      const challengeKey = `beat_challenge_${challengerName}_${inviterScore}`;
      localStorage.setItem(challengeKey, 'true');
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [score, inviterScore, challengerName, hasBeatenChallenge]);

  // For test purposes - add a button to simulate score changes
  const simulateScoreIncrease = () => {
    // Create and dispatch the custom event that the ScoreContext is listening for
    const event = new CustomEvent('globetrotterScoreUpdate', { 
      detail: { score: score + 10 } 
    });
    window.dispatchEvent(event);
  };

  const isChallenge = inviterScore !== undefined;
  const hasBeatChallenge = isChallenge && score > (inviterScore || 0);

  return (
    <div className="max-w-4xl mx-auto">
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 confetti-animation"></div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Globetrotter Challenge</h1>
        
        {isChallenge ? (
          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">{challengerName}</span>
                <span className="font-bold text-xl">{inviterScore}</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${hasBeatChallenge ? 'bg-green-500' : 'bg-indigo-500'}`}
                    style={{ width: `${hasBeatChallenge ? '100%' : Math.min((score / (inviterScore || 1)) * 100, 90)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">You</span>
                <span className="font-bold text-xl">{score}</span>
              </div>
            </div>
            
            {hasBeatChallenge ? (
              <div className="bg-green-100 p-3 rounded-md border-l-4 border-green-500">
                <p className="text-green-800 font-medium text-center">
                  🎉 Congratulations! You beat {challengerName}'s challenge!
                </p>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-600">
                Continue playing Globetrotter to beat {challengerName}'s score of {inviterScore}!
              </p>
            )}
          </div>
        ) : (
          <p className="text-lg text-gray-700 mb-6 text-center">Welcome, {playerName}!</p>
        )}
        
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Current Score: {score}</h2>
          <div className="text-center text-gray-600 mb-4">
            <p>Play the Globetrotter game to increase your score!</p>
            <p className="text-sm mt-2">Your score updates automatically as you play.</p>
          </div>
          
          {/* Game instructions */}
          <div className="bg-blue-50 p-4 rounded-md text-sm text-gray-700 mb-4">
            <h3 className="font-bold mb-2">How to play:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Guess the locations on the map</li>
              <li>Answer geography questions</li>
              <li>Complete challenges to earn points</li>
              <li>Your score will increase as you progress</li>
            </ol>
          </div>
          
          <div className="flex justify-center flex-wrap gap-3">
            <a 
              href="/game" 
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md transition-colors duration-200 font-medium shadow-sm"
            >
              Play Globetrotter
            </a>
            
            {/* Test button for demo purposes */}
            <button 
              onClick={simulateScoreIncrease} 
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-md transition-colors duration-200 font-medium shadow-sm text-sm"
            >
              +10 Score (Demo)
            </button>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium shadow-md transition-colors duration-200 flex items-center"
            onClick={() => setShowInviteModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Challenge a Friend
          </button>
        </div>
      </div>
      
      <InviteFriendModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        playerName={playerName}
        playerId={playerId}
        score={score}
      />
    </div>
  );
};

export default Game;
