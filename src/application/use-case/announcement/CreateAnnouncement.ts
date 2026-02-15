import { logger } from "@/utils/logger";
import {
    Announcement,
    CreateAnnouncementPayload,
} from "../../../domain/entities/announcement/Announcement";
import { IAnnouncementRepository } from "../../../domain/repositories/AnnouncementRepository";
import { IMessagingRepository } from "../../../domain/repositories/MessagingRepository";

export class CreateAnnouncementUseCase {
    constructor(
        private announcementRepo: IAnnouncementRepository,
        private messagingRepo: IMessagingRepository,
    ) {}

    async execute(payload: CreateAnnouncementPayload): Promise<Announcement> {
        let createdAnnouncementId: string | undefined;

        try {
            const announcement =
                await this.announcementRepo.createAnnouncement(payload);
            createdAnnouncementId = announcement.id;

            const conversationId = await this.messagingRepo.createConversation(
                announcement.id,
            );

            await this.announcementRepo.updateConversationId(
                announcement.id,
                conversationId,
            );

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
