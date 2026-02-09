import { Announcement } from "../../../domain/entities/announcement/Announcement";
import { IAnnouncementRepository } from "../../../domain/repositories/AnnouncementRepository";

export class GetAnnouncementsList {
    constructor(private announcementRepo: IAnnouncementRepository) {}

    async execute(
        page: number,
        pageSize: number = 5,
        fcId?: string | null,
    ): Promise<{ announcements: Announcement[]; totalCount: number }> {
        const result = await this.announcementRepo.getAllAnnouncements(
            page,
            pageSize,
            fcId,
        );

        return result;
    }
}
