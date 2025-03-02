import { User } from "./user";

export interface Invite {
  id: string;
  sender: User;
  recipient: User;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt?: string;
  message?: string;
  game?: string;  // Game ID if invite is for a specific game
}
