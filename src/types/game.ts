export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  genre: string;
  platform: string | string[];
  publisher: string;
  releaseDate: string;
  
  // These fields were in the previous interface but can be optional now
  name?: string;
  imageUrl?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  playCount?: number;
  categories?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}
