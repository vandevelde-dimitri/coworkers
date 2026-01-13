import { supabase } from "../../../utils/supabase";
import { StatusNotification } from "../../types/enum/statusNotification.enum";
import { NotificationResponse } from "../../types/notification.interface";

export async function getAllNotificationByUser(): Promise<
    NotificationResponse[]
> {
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
    const { data, error } = await supabase.rpc("get_my_notifications");

    if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }

    console.log("✅ notification", data);

    // 🔹 Transformation pour l’écran
    const formatted: NotificationResponse[] = (data ?? []).map(
        (item: NotificationResponse) => {
            const user = {
                firstname: item.candidate_firstname,
                lastname: item.candidate_lastname,
            };

            return {
                id: item.id,
                annonceId: item.annonce_id,
                annonceTitle: item.annonce_title,
                userId: item.candidate_id,
                status: item.status,
                candidate_firstname: item.candidate_firstname,
                candidate_lastname: item.candidate_lastname,
                image_profile: item.candidate_image,
                avatar_updated_at: item.created_at,
                message: getMessageByStatus(
                    item.status,
                    item.annonce_title,
                    user
                ),
                created_at: item.created_at,
            };
        }
    );

    return formatted;
}

// 🔹 Génération message
function getMessageByStatus(
    status: string,
    annonce_title: string,
    user: {
        firstname: string;
        lastname: string;
    }
) {
    switch (status) {
        case StatusNotification.PENDING:
            return `${user.firstname} ${user.lastname} a postulé à votre annonce "${annonce_title}"`;

        case StatusNotification.ACCEPTED:
            return `Vous avez accepté une candidature pour "${annonce_title}"`;

        case StatusNotification.REJECTED:
            return `Vous avez refusé une candidature pour "${annonce_title}"`;

        case StatusNotification.DELETE:
            return `Vous avez supprimée l'annonce "${annonce_title}"`;

        default:
            return "Aucune notification disponible.";
    }
}
