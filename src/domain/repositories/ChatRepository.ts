import { Conversation } from "../entities/chat/Conversation";

export interface ChatRepository {
    getUserConversations(userId: string): Promise<Conversation[]>;
}
