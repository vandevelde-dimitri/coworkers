import { logger } from "@/utils/logger";
import { UpdateAnnouncementPayload } from "../../../domain/entities/announcement/Announcement";
import { IAnnouncementRepository } from "../../../domain/repositories/AnnouncementRepository";

export class UpdateAnnouncementUseCase {
    constructor(private announcementRepo: IAnnouncementRepository) {}

    async execute(id: string, data: UpdateAnnouncementPayload): Promise<void> {
        try {
            await this.announcementRepo.updateAnnouncement(id, data);
        } catch (error) {
            const fields = Object.keys(data).join(", ");
            await logger.critical(
                "ERR_ANN_UPDATE",
                `Échec de la mise à jour de l'annonce => ${id} , champs: ${fields}`,
                error,
            );

            throw error;
        }
    }
}
