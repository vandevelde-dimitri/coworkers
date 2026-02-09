import {
    Announcement,
    CreateAnnouncementPayload,
} from "../../../domain/entities/announcement/Announcement";
import { IAnnouncementRepository } from "../../../domain/repositories/AnnouncementRepository";
import { IMessagingRepository } from "../../../domain/repositories/MessagingRepository";
import { logger } from "../../../utils/logger";

export class CreateAnnouncementUseCase {
    constructor(
        private announcementRepo: IAnnouncementRepository,
        private messagingRepo: IMessagingRepository,
    ) {}

    async execute(payload: CreateAnnouncementPayload): Promise<Announcement> {
        let createdAnnouncementId: string | undefined;

        try {
            // 1. Création de l'annonce
            const announcement =
                await this.announcementRepo.createAnnouncement(payload);
            createdAnnouncementId = announcement.id;

            // 2. Création de la conversation
            const conversationId = await this.messagingRepo.createConversation(
                announcement.id,
            );

            // 3. Mise à jour de l'annonce avec l'ID de conv
            await this.announcementRepo.updateConversationId(
                announcement.id,
                conversationId,
            );

            // 4. Ajout du conducteur comme participant
            await this.messagingRepo.addParticipant(
                conversationId,
                announcement.owner.id,
            );

            return announcement;
        } catch (error) {
            if (createdAnnouncementId) {
                await this.announcementRepo
                    .deleteAnnouncement(createdAnnouncementId)
                    .catch(() => {
                        if (__DEV__)
                            console.error(
                                "Échec du rollback : annonce orpheline créée",
                            );
                    });
            }
            await logger.critical(
                "ERR_ANN_CREATE_FLOW",
                "Flux complet de création d'annonce",
                error,
                payload.owner.id,
            );
            throw error;
        }
    }
}
