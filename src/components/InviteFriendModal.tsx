import React, { useRef, useState, useEffect } from 'react';
import { createInvitation } from '../services/invitation.service';
import html2canvas from 'html2canvas';
import { useScore } from '../contexts/ScoreContext';

interface InviteFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  playerId: string;
  score?: number; // Make score optional, we'll use the context if not provided
}

const InviteFriendModal: React.FC<InviteFriendModalProps> = ({
  isOpen,
  onClose,
  playerName,
  playerId,
  score: propScore, // Score passed from props
}) => {
  // Use the score from context if not provided via props
  const { score: contextScore } = useScore();
  const score = propScore !== undefined ? propScore : contextScore;
  
  const [invitationLink, setInvitationLink] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState<boolean>(false);
  const inviteCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      generateInvitationLink();
    }
  }, [isOpen]);

  const generateInvitationLink = async () => {
    setIsLoading(true);
    try {
      const response = await createInvitation(playerId, playerName, score);
      setInvitationLink(response.invitationLink);
      setTimeout(() => {
        generateInvitationImage();
      }, 500);
    } catch (error) {
      console.error('Failed to create invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const shareOnWhatsApp = () => {
    const text = `🎮 Game Challenge from ${playerName}! Can you beat my score of ${score}? Click to play: ${invitationLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(invitationLink);
    setShowCopiedMessage(true);
    setTimeout(() => {
      setShowCopiedMessage(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
        <button 
          className="absolute top-3 right-3 text-3xl text-gray-400 hover:text-gray-600 border-none bg-transparent" 
          onClick={onClose}
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Challenge a Friend</h2>
        
        <div 
          className="border-2 border-blue-500 rounded-lg overflow-hidden mb-6 bg-gradient-to-b from-blue-50 to-white shadow-md" 
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
            
            <div className="mt-3 text-lg font-bold text-gray-800">Can you beat my score?</div>
            <p className="text-sm text-gray-500 mt-2">Click the link to accept the challenge!</p>
          </div>
        </div>
        
        {imageUrl && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Shareable preview generated:</p>
            <div className="flex justify-center">
              <img 
                src={imageUrl} 
                alt="Challenge invitation" 
                className="w-40 h-auto rounded shadow-sm"
              />
            </div>
          </div>
        )}
        
        {invitationLink && (
          <div className="mb-5 relative">
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
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button 
            className={`py-2.5 px-4 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={shareOnWhatsApp}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Share on WhatsApp
          </button>
          
          <button 
            className={`py-2.5 px-4 rounded-md font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={onClose}
            disabled={isLoading}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteFriendModal;
