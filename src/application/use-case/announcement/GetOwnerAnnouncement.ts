import { Announcement } from "@/src/domain/entities/announcement/Announcement";
import { IAnnouncementRepository } from "@/src/domain/repositories/AnnouncementRepository";

export class GetOwnerAnnouncement {
    constructor(private announcementRepo: IAnnouncementRepository) {}

    async execute(): Promise<Announcement | null> {
        return this.announcementRepo.findOwnerAnnouncement();
    }
}
