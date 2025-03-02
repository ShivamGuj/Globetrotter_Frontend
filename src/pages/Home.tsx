import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Game Portal</h1>
      <p className="text-xl mb-8">Ready to play? Jump right in!</p>
      
      <div className="flex flex-col items-center justify-center gap-4">
        <Link 
          to="/game" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
        >
          Play Now
        </Link>
        
        {user ? (
          <Link 
            to="/invite" 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
          >
            Invite a Friend
          </Link>
        ) : (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg max-w-lg">
            <p className="mb-2">
              You can play without signing in, but you'll need an account to challenge others and save your scores.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign In
              </Link>
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
