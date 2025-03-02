export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
  bio?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
}

export interface UserProfile extends User {
  bio?: string;
  favoriteGames?: string[];
}

export interface UserUpdateData {
  username?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
  bio?: string;
}
