import { supabase } from "../../../utils/supabase";
import { StatusNotification } from "../../types/enum/statusNotification.enum";
import { NotificationResponse } from "../../types/notification.interface";

export async function getAllNotificationsByUserCandidate(): Promise<
    NotificationResponse[]
> {
    try {
        // 🔹 Récupération session
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
            console.error("❌ Session error:", sessionError);
            return [];
        }

        // 🔹 Requête notifications pour le propriétaire
        const { data, error } = await supabase.rpc(
            "get_my_candidate_notifications",
        );

        if (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }

 

        // 🔹 Transformation pour l’écran
        const formatted: NotificationResponse[] = (data ?? []).map(
            (item: NotificationResponse) => {
                return {
                    id: item.id,
                    annonceId: item.annonce_id,
                    annonceTitle: item.annonce_title,
                    userId: item.candidate_id,
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
            console.error("getAllNotificationsByUserCandidate error:", error);
        throw error;
    }
}

// 🔹 Génération message
function getMessageByStatus(status: string, annonce_title: string) {
    switch (status) {
        case StatusNotification.ACCEPTED:
            return `Votre candidature à ${annonce_title} a été acceptée`;

        case StatusNotification.REJECTED:
            return `Votre candidature à "${annonce_title}" a été refusée`;

        case StatusNotification.DELETE:
            return `l'annonce "${annonce_title}" a été supprimée`;

        default:
            return "Aucune notification disponible.";
    }
}
