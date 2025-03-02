import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createInvitation } from '../services/invitation.service';
import html2canvas from 'html2canvas';

const Invite: React.FC = () => {
  // Auth and navigation
  const { user, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [customMessage, setCustomMessage] = useState('');
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  
  // Invitation state
  const [invitationLink, setInvitationLink] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState<boolean>(false);
  const [invitationCreated, setInvitationCreated] = useState<boolean>(false);
  
  // Refs
  const inviteCardRef = useRef<HTMLDivElement>(null);
  
  // Get player name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerName(storedName);
    } else {
      const defaultName = `Player${Math.floor(Math.random() * 1000)}`;
      setPlayerName(defaultName);
      localStorage.setItem('playerName', defaultName);
    }
    
    // Initialize player ID if needed
    const storedId = localStorage.getItem('playerId');
    if (!storedId) {
      localStorage.setItem('playerId', crypto.randomUUID());
    }
  }, []);

  // Redirect if not logged in (optional)
  useEffect(() => {
    if (!user && import.meta.env.VITE_REQUIRE_AUTH === 'true') {
      navigate('/signin', { state: { from: '/invite', message: 'Please sign in to invite other players' } });
    }
  }, [user, navigate]);
  
  // Create invitation
  const generateInvitation = async () => {
    setIsLoading(true);
    try {
      const playerId = localStorage.getItem('playerId') || crypto.randomUUID();
      const response = await createInvitation(playerId, playerName, score);
      setInvitationLink(response.invitationLink);
      setInvitationCreated(true);
      setTimeout(() => {
        generateInvitationImage();
      }, 500);
    } catch (error) {
      console.error('Failed to create invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate image for sharing
  const generateInvitationImage = async () => {
    if (inviteCardRef.current) {
      try {
        const canvas = await html2canvas(inviteCardRef.current, {
          scale: 2,
          backgroundColor: null,
          logging: false
        });
        const dataUrl = canvas.toDataURL('image/png');
        setImageUrl(dataUrl);
      } catch (error) {
        console.error('Failed to generate image:', error);
      }
    }
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const text = `🎮 Game Challenge from ${playerName}! Can you beat my score of ${score}? ${customMessage ? `"${customMessage}" ` : ''}Click to play: ${invitationLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Copy link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    setShowCopiedMessage(true);
    setTimeout(() => {
      setShowCopiedMessage(false);
    }, 2000);
  };
  
  // Reset form
  const resetForm = () => {
    setInvitationCreated(false);
    setInvitationLink('');
    setImageUrl('');
    setCustomMessage('');
    setScore(0);
  };
  
  // Form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateInvitation();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Challenge a Friend</h1>
      
      {!invitationCreated ? (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="playerName">
                Your Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="playerName"
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  localStorage.setItem('playerName', e.target.value);
                }}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="score">
                Your Score to Challenge
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="score"
                type="number"
                min="0"
                placeholder="Enter your score"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customMessage">
                Custom Message (optional)
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="customMessage"
                placeholder="Add a personal message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{customMessage.length}/100 characters</p>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition duration-200 flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Create Challenge
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Challenge is Ready!</h2>
            <p className="text-gray-600 mt-1">Share this challenge with your friends to see if they can beat your score.</p>
          </div>
          
          <div 
            className="border-2 border-blue-500 rounded-lg overflow-hidden mb-6 bg-gradient-to-b from-blue-50 to-white shadow-md mx-auto max-w-sm" 
            ref={inviteCardRef}
          >
            <div className="bg-blue-500 text-white p-3 text-center text-xl font-bold">
              Game Challenge!
            </div>
            <div className="p-6 text-center">
              <div className="mb-3 font-semibold text-blue-600">From</div>
              <p className="text-xl font-bold mb-2">{playerName}</p>
              
              <div className="flex items-center justify-center my-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {score}
                </div>
              </div>
              
              {customMessage && (
                <div className="my-3 italic text-gray-600">"{customMessage}"</div>
              )}
              
              <div className="mt-3 text-lg font-bold text-gray-800">Can you beat my score?</div>
              <p className="text-sm text-gray-500 mt-2">Click the link to accept the challenge!</p>
            </div>
          </div>
          
          {imageUrl && (
            <div className="mb-6 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Shareable preview generated:</p>
              <div className="flex justify-center">
                <img 
                  src={imageUrl} 
                  alt="Challenge invitation" 
                  className="w-48 h-auto rounded shadow-sm"
                />
              </div>
            </div>
          )}
          
          {invitationLink && (
            <div className="mb-6 relative">
              <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
                <input 
                  type="text"
                  readOnly
                  value={invitationLink}
                  className="flex-1 p-2.5 text-sm bg-transparent border-0 outline-none truncate"
                />
                <button 
                  onClick={copyLink}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-2.5 text-sm font-medium"
                >
                  Copy
                </button>
              </div>
              {showCopiedMessage && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                  Copied!
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button 
              className="py-2.5 px-4 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
              onClick={shareOnWhatsApp}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Share on WhatsApp
            </button>
            
            <button 
              className="py-2.5 px-4 rounded-md font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200 flex-1"
              onClick={() => navigate('/game')}
            >
              Play Game
            </button>
            
            <button 
              className="py-2.5 px-4 rounded-md font-medium bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors duration-200"
              onClick={resetForm}
            >
              Create Another
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mt-4">
        <h3 className="text-lg font-semibold text-blue-800">How it works</h3>
        <ol className="list-decimal pl-5 mt-2 space-y-1 text-gray-700">
          <li>Create a challenge with your name and score</li>
          <li>Share the challenge link with friends</li>
          <li>They'll see your score when they open the link</li>
          <li>They can play the game and try to beat your score</li>
          <li>Create more challenges to compete with different friends</li>
        </ol>
      </div>
    </div>
  );
};

export default Invite;
