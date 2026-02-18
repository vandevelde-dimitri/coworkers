import { ChatRepository } from "@/src/domain/repositories/ChatRepository";

export class SendMessage {
    constructor(private chatRepository: ChatRepository) {}

    /**
     * Exécute l'envoi d'un message
     * @param conversationId L'ID de la conversation cible
     * @param userId L'ID de l'expéditeur (toi)
     * @param content Le contenu texte du message
     */
    async execute(conversationId: string, userId: string, content: string): Promise<void> {
        // Validation métier simple
        if (!content || content.trim().length === 0) {
            throw new Error("Le message ne peut pas être vide.");
        }

        if (!conversationId || !userId) {
            throw new Error("Informations de conversation ou d'utilisateur manquantes.");
        }

        try {
            await this.chatRepository.sendMessage(conversationId, userId, content.trim());
        } catch (error) {
            // Ici tu pourrais ajouter une logique de logging plus poussée
            throw new Error("Impossible d'envoyer le message. Veuillez réessayer.");
        }
    }
}
