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
        avatarUrl: string | null;
        avatarUpdatedAt: string | null;
        contract?: string | null;
    };
}
