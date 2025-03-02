import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Game Portal</Link>
        
        <nav className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/game" className="hover:text-gray-300">Play</Link>
          
          {user ? (
            <>
              <Link to="/invite" className="hover:text-gray-300">Invite</Link>
              <span className="hover:text-gray-300">Welcome, {user.username}</span>
              <button 
                onClick={logout} 
                className="hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="hover:text-gray-300">Sign In</Link>
              <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
