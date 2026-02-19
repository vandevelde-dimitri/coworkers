import { ChatRepository } from "@/src/domain/repositories/ChatRepository";

export class SendMessage {
    constructor(private chatRepository: ChatRepository) {}

    async execute(conversationId: string, content: string): Promise<void> {
        if (!content || content.trim().length === 0) {
            throw new Error("Le message ne peut pas être vide.");
        }

        if (!conversationId) {
            throw new Error(
                "Informations de conversation ou d'utilisateur manquantes.",
            );
        }

        try {
            await this.chatRepository.sendMessage(
                conversationId,
                content.trim(),
            );
        } catch (error) {
            throw new Error(
                "Impossible d'envoyer le message. Veuillez réessayer.",
            );
        }
    }
}
