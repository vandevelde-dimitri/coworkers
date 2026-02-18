import { Conversation } from "../entities/chat/Conversation";
import { Message } from "../entities/chat/Message";

export interface ChatRepository {
    getUserConversations(userId: string): Promise<Conversation[]>;
    getMessages(conversationId: string, page: number, pageSize: number, userId: string): Promise<Message[]>;
    sendMessage(conversationId: string, senderId: string, content: string): Promise<void>;
}
