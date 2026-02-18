import { Conversation } from "@/src/domain/entities/chat/Conversation";

export class ChatMapper {
    static toDomain(item: any, currentUserId: string): Conversation {
        const conv = item.conversations;

        const annonce = conv?.annonces;
        const user = annonce?.users;

        const messages = conv?.messages || [];
        const lastMsg = messages.length > 0 ? messages[0] : null;

        return {
            id: conv?.id || item.conversation_id,
            annonceTitle: annonce?.title || "Discussion sans titre",
            lastMessage: lastMsg?.content || "Pas encore de message",
            lastMessageTime: lastMsg?.created_at || null,
            interlocutor: {
                id: user?.id || "",
                firstName: user?.firstname || "Utilisateur",
                lastName: user?.lastname || "",
                avatarUrl: user?.image_profile || null,
                avatarUpdatedAt: user?.avatar_updated_at || null,
            },
        };
    }

    static toDomainList(data: any[], currentUserId: string): Conversation[] {
        if (!data) return [];
        return data.map((item) => this.toDomain(item, currentUserId));
    }
}
