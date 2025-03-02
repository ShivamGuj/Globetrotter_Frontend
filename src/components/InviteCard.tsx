import { Invite } from "../types/invite";

interface InviteCardProps {
  invite: Invite;
}

const InviteCard: React.FC<InviteCardProps> = ({ invite }) => (
  <div className="border p-4 rounded shadow-md">
    <p>Invite Link: <a href={invite.link} className="text-blue-600">{invite.link}</a></p>
  </div>
);

export default InviteCard;
