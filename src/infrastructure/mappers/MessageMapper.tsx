import { MessageInterface } from "@/src/domain/entities/chat/Message";

export class MessageMapper {
    static toDomain(raw: any, currentUserId: string) {
        const user = raw.users;
        return {
            id: raw.id,
            conversationId: raw.conversation_id,
            content: raw.content,
            createdAt: raw.created_at,
            isMine: raw.sender_id === currentUserId,
            sender: {
                id: raw.sender_id,
                firstName: user?.firstname,
                lastName: user?.lastname,
                avatarUrl: user?.image_profile || null,
                avatarUpdatedAt: user?.avatar_updated_at || null,
                contract: user?.contract || null,
            },
        };
    }

    static toDomainList(
        rawList: any[],
        currentUserId: string,
    ): MessageInterface[] {
        if (!rawList) return [];
        return rawList.map((item) => this.toDomain(item, currentUserId));
    }
}
