import { User } from './user';

export interface AuthResponse {
  user: User;
  access_token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  username: string;
  confirmPassword?: string;
}
