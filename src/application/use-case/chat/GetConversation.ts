import { ChatRepository } from "@/src/domain/repositories/ChatRepository";

export class GetConversationsUseCase {
    constructor(private chatRepository: ChatRepository) {}

    async execute(userId: string) {
        if (!userId) throw new Error("User ID is required");
        return await this.chatRepository.getUserConversations(userId);
    }
}
