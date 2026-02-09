import { logger } from "@/utils/logger";
import { IAnnouncementRepository } from "../../../domain/repositories/AnnouncementRepository";

export class DeleteAnnouncementUseCase {
    constructor(private announcementRepo: IAnnouncementRepository) {}

    async execute(announcementId: string): Promise<void> {
        try {
            await this.announcementRepo.deleteAnnouncement(announcementId);
        } catch (error) {
            await logger.critical(
                "ERR_ANN_DELETE",
                `Suppression d'une annonce => ${announcementId} `,
                error,
            );
            throw error;
        }
    }
}
