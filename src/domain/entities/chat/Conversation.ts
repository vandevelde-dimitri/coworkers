export interface Conversation {
    id: string;
    annonceTitle: string;
    lastMessage: string;
    lastMessageTime: string | null;
    interlocutor: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | undefined;
        avatarUpdatedAt: string | null;
    };
}
