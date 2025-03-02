import React from "react";
import { Invite } from "../types/invite";

interface InviteCardProps {
  invite: Invite;
}

const InviteCard: React.FC<InviteCardProps> = ({ invite }) => (
  <div className="border p-4 rounded shadow-md">
    <p>Invite Link: <a href={invite.invitationLink} className="text-blue-600">{invite.invitationLink}</a></p>
  </div>
);

export default InviteCard;
