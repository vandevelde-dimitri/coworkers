import {
    AnnonceDetail,
    Announcement,
} from "../src/types/announcement.interface";

/**
 * Vérifie si l'annonce appartient à l'utilisateur actuel
 */
export const isMyAnnouncement = (
    announcement: AnnonceDetail | undefined,
    currentUserId: string | undefined
): boolean => {
    if (!announcement || !currentUserId) {
        return false;
    }
    return announcement.owner.id === currentUserId;
};

/**
 * Vérifie si la date de l'annonce est passée
 */
export const isAnnouncementExpired = (announcement: Announcement): boolean => {
    const today = new Date();
    const startDate = new Date(announcement.date_start);
    return startDate < today;
};
