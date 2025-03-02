import { User } from "./user";

export interface Invite {
  id: string;
  invitationLink: string; // This matches the property name from the backend
  inviterId?: string;
  inviterName?: string;
  score?: number;
  createdAt?: Date;
  sender: User;
  recipient: User;
  status: "pending" | "accepted" | "rejected";
  updatedAt?: string;
  message?: string;
  game?: string;  // Game ID if invite is for a specific game
}
