import { Announcement } from "@/types/announcement.interface";

/**
 * Vérifie si l'annonce appartient à l'utilisateur actuel
 */
export const isMyAnnouncement = (
    announcement: Announcement,
    currentUserId: string | undefined
): boolean => {
    if (!announcement || !currentUserId) {
        return false;
    }
    return announcement.user_id === currentUserId;
};

/**
 * Vérifie si l'utilisateur peut modifier l'annonce
 */
export const canEditAnnouncement = (
    announcement: Announcement,
    currentUserId: string | undefined
): boolean => {
    return isMyAnnouncement(announcement, currentUserId);
};

/**
 * Vérifie si l'annonce est encore disponible (places restantes)
 */
export const isAnnouncementAvailable = (
    announcement: Announcement
): boolean => {
    return announcement.number_of_places > 0;
};

/**
 * Vérifie si la date de l'annonce est passée
 */
export const isAnnouncementExpired = (announcement: Announcement): boolean => {
    const today = new Date();
    const startDate = new Date(announcement.date_start);
    return startDate < today;
};
