import {
    Announcement,
    CreateAnnouncementPayload,
    UpdateAnnouncementPayload,
} from "../entities/announcement/Announcement";

export interface IAnnouncementRepository {
    findOwnerAnnouncement(): Promise<Announcement | null>;
    getAnnouncementById(id: string): Promise<Announcement | null>;
    getAllAnnouncements(
        page: number,
        pageSize: number,
        search: string,
        fcId?: string | null,
    ): Promise<{ announcements: Announcement[]; totalCount: number }>;
    createAnnouncement(
        announcement: CreateAnnouncementPayload,
    ): Promise<Announcement>;
    updateAnnouncement(
        announcementId: string,
        data: UpdateAnnouncementPayload,
    ): Promise<void>;
    deleteAnnouncement(announcementId: string): Promise<void>;
    updateConversationId(
        announcementId: string,
        conversationId: string,
    ): Promise<void>;
}
