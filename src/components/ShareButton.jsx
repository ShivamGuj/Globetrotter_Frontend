import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

const ShareButton = ({ username, score }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  const [copying, setCopying] = useState(false);
  
  const shareLink = `${window.location.origin}/challenge/${username}`;
  
  const generateShareImage = async () => {
    const shareCard = document.getElementById('share-card');
    
    try {
      const canvas = await html2canvas(shareCard, {
        backgroundColor: null,
        scale: 2,
      });
      
      const imageData = canvas.toDataURL('image/png');
      setShareImage(imageData);
    } catch (error) {
      console.error('Error generating share image:', error);
    }
  };
  
  const handleShowShareModal = async () => {
    setShowShareModal(true);
    await generateShareImage();
  };
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const shareToWhatsApp = () => {
    const text = `I scored ${score.correct} out of ${score.correct + score.incorrect} in Globetrotter! Challenge me: ${shareLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShowShareModal}
        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 sm:px-6 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base order-1 sm:order-2"
      >
        <span className="mr-2">🏆</span> Challenge a Friend
      </motion.button>
      
      {/* Hidden div for generating share image */}
      <div id="share-card" className="fixed -left-[1000px] bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-2xl font-bold text-indigo-600 mb-3">Globetrotter Challenge</h2>
        <p className="text-lg mb-4">
          <span className="font-medium">{username}</span> has scored{" "}
          <span className="text-green-600 font-bold">{score?.correct}</span> out of{" "}
          <span className="font-bold">{score?.correct + score?.incorrect}</span> in Globetrotter!
        </p>
        <div className="border-t border-gray-200 pt-3">
          <p>Can you beat their score? Click the link to play!</p>
        </div>
      </div>
      
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg p-4 sm:p-6 max-w-sm sm:max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Challenge a Friend</h3>
              
              <div className="mb-4 sm:mb-5">
                {shareImage ? (
                  <img src={shareImage} alt="Challenge" className="w-full rounded-lg mb-3 sm:mb-4" />
                ) : (
                  <div className="w-full h-32 sm:h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                )}
              </div>
              
              <div className="flex mb-4 w-full">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-grow px-2 sm:px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm overflow-hidden"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-2 sm:px-4 py-2 ${
                    copying ? "bg-green-500" : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white rounded-r-md transition-colors whitespace-nowrap text-sm`}
                >
                  {copying ? "Copied!" : "Copy"}
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3">
                <button
                  onClick={shareToWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md flex items-center justify-center text-sm sm:text-base"
                >
                  <span className="mr-2">📱</span> WhatsApp
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-md text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButton;
