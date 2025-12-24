import { Announcement } from "@/types/announcement.interface";
import { getCurrentUser } from "../src/api/user/getCurrentUser";
import { supabase } from "./supabase";

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

export const canApplyToAnnouncement = async (
    announcement: Announcement
): Promise<boolean> => {
    try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        if (!session) return false;

        const currentUser = await getCurrentUser(session);
        const userHasVehicle = !!currentUser.to_convey;
        const ownerHasVehicle = !!announcement.users.to_convey;

        return userHasVehicle || ownerHasVehicle;
    } catch (error) {
        console.error("Error checking if user can apply:", error);
        return false;
    }
};

/**
 * Vérifie si l'utilisateur a déjà postulé à cette annonce
 */
export const hasAlreadyApplied = async (announcementId: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return false;

    try {
        const { data: appliedData, error } = await supabase
            .from("user_annonces")
            .select("id")
            .eq("annonce_id", announcementId)
            .eq("user_id", sessionData.session.user.id);

        if (error) {
            console.error("Error checking if user has applied:", error);
            return false;
        }

        return appliedData && appliedData.length > 0;
    } catch (err) {
        console.error("Unexpected error:", err);
        return false;
    }
};
