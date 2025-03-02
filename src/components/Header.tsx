import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className=" bg-gray-100 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">GlobeTrotter</Link>
        
        <nav className="flex items-center">
          <Link to="/game" className="mr-4 hover:text-blue-200">Play</Link>
          
          {user ? (
            <div className="flex items-center">
              <span className="mr-4">Hi, {user.username}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link to="/signin" className="mr-4 hover:text-blue-200">Sign In</Link>
              <Link 
                to="/signup"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
