import { Announcement } from "../../../domain/entities/announcement/Announcement";
import { IAnnouncementRepository } from "../../../domain/repositories/AnnouncementRepository";

export class GetAnnouncementById {
    constructor(private announcementRepo: IAnnouncementRepository) {}

    async execute(id: string): Promise<Announcement | null> {
        const announcement =
            await this.announcementRepo.getAnnouncementById(id);

        return announcement;
    }
}
