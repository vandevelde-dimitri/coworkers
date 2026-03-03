import { UserContract } from "../user/User.enum";

export interface Conversation {
  id: string;
  annonceTitle: string;
  lastMessage: string;
  lastMessageTime: string | null;
  interlocutor: {
    id: string;
    firstName: string;
    lastName: string;
    profileAvatar: string | undefined;
    avatarUpdatedAt: string | null;
    contract: UserContract;
  };
}
