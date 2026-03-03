export interface MessageInterface {
  id: string;
  conversationId: string;
  content: string;
  createdAt: string;
  isMine: boolean;
  sender: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileAvatar: string;
    avatarUpdatedAt: string;
    contract?: string | null;
  };
}
