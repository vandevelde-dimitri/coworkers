import { supabase } from "../../../utils/supabase";
import { StatusNotification } from "../../types/enum/statusNotification.enum";
import { NotificationResponse } from "../../types/notification.interface";

export async function getAllNotificationsByUserCandidate(): Promise<
    NotificationResponse[]
> {
    try {
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
            if (__DEV__) console.error("❌ Session error:", sessionError);
            return [];
        }

        const { data, error } = await supabase.rpc(
            "get_my_candidate_notifications",
        );

        if (error) {
            if (__DEV__) console.error("Error fetching notifications:", error);
            throw error;
        }

        console.log("data notification", data);

        const formatted: NotificationResponse[] = (data ?? []).map(
            (item: NotificationResponse) => {
                return {
                    id: item.id,
                    annonceId: item.annonce_id,
                    annonceTitle: item.annonce_title,
                    user_id: item.candidate_id,
                    status: item.status,
                    message: getMessageByStatus(
                        item.status,
                        item.annonce_title,
                    ),
                    created_at: item.created_at,
                };
            },
        );

        return formatted;
    } catch (error) {
        if (__DEV__)
            if (__DEV__)
                console.error(
                    "getAllNotificationsByUserCandidate error:",
                    error,
                );
        throw error;
    }
}

function getMessageByStatus(status: string, annonce_title: string) {
    switch (status) {
        case StatusNotification.ACCEPTED:
            return `Votre candidature à ${annonce_title} a été acceptée`;

        case StatusNotification.REFUSED:
            return `Votre candidature à "${annonce_title}" a été refusée`;

        case StatusNotification.DELETE:
            return `l'annonce "${annonce_title}" a été supprimée`;

        case StatusNotification.REMOVE:
            return `Vous avez été retiré de l'annonce "${annonce_title}"`;

        default:
            return "Aucune notification disponible.";
    }
}
