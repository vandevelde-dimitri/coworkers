import { Conversation } from "../entities/chat/Conversation";
import { MessageInterface } from "../entities/chat/Message";

export interface ChatRepository {
    getUserConversations(userId: string): Promise<Conversation[]>;
    getMessages(
        conversationId: string,
        page: number,
        pageSize: number,
        userId: string,
    ): Promise<MessageInterface[]>;
    sendMessage(conversationId: string, content: string): Promise<void>;
}
