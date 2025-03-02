import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  return (
    <nav className="bg-indigo-600 shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-white text-xl sm:text-2xl font-bold font-heading">Globetrotter</h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/game" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Play</Link>
              
              {user && (
                <div className="text-white px-3 py-2 rounded-md text-sm font-medium">
                  <span className="mr-2">👤</span>
                  {user.username} • Score: {user.score.correct}/{user.score.correct + user.score.incorrect}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-700">
            <Link 
              to="/" 
              className="text-white hover:bg-indigo-800 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/game" 
              className="text-white hover:bg-indigo-800 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              onClick={() => setIsOpen(false)}
            >
              Play
            </Link>
            
            {user && (
              <div className="text-white block px-3 py-2 rounded-md text-sm font-medium w-full text-left">
                <span className="mr-2">👤</span>
                {user.username} • Score: {user.score.correct}/{user.score.correct + user.score.incorrect}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
