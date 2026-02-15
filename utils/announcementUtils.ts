import { Announcement } from "@/src/domain/entities/announcement/Announcement";

export const isMyAnnouncement = (
    announcement: Announcement | undefined,
    currentUserId: string | undefined,
): boolean => {
    if (!announcement || !currentUserId) {
        return false;
    }
    return announcement.owner.id === currentUserId;
};
