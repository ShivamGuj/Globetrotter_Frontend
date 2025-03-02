import React from 'react';
import { Game } from '../types/game';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  // Add defensive checks to prevent errors with undefined values
  if (!game) {
    return <div className="game-card loading">Loading game data...</div>;
  }

  // Check if platform is a string or array and handle accordingly
  const platformDisplay = typeof game.platform === 'string' 
    ? game.platform 
    : Array.isArray(game.platform) 
      ? game.platform.join(', ')
      : 'Multiple Platforms';

  return (
    <div className="game-card">
      <img 
        src={game.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'} 
        alt={game.title} 
        className="game-thumbnail"
      />
      <div className="game-details">
        <h3>{game.title}</h3>
        <p className="game-description">{game.description}</p>
        <div className="game-meta">
          <span className="genre">{game.genre}</span>
          <span className="platform">{platformDisplay}</span>
          <span className="publisher">{game.publisher}</span>
          <span className="release-date">{game.releaseDate}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
