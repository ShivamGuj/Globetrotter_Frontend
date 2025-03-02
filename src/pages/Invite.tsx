import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Invite: React.FC = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { user, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is not logged in, redirect to sign in page
    if (!user) {
      navigate('/signin', { state: { from: '/invite', message: 'Please sign in to invite other players' } });
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username) {
      setError('Please enter a username');
      return;
    }
    
    // Here you would typically send an invite to the specified user
    // For now, we'll just navigate to a hypothetical game page
    navigate(`/game?opponent=${username}`);
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Invite a Player</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Player Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Enter username to invite"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send Invite
        </button>
      </form>
    </div>
  );
};

export default Invite;
