import { supabase } from "../../../utils/supabase";
import { StatusNotification } from "../../types/enum/statusNotification.enum";
import { Notification } from "../../types/notification.interface";

export async function getAllNotificationByUser(): Promise<Notification[]> {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
        console.error("❌ Session error:", sessionError);
        throw sessionError;
    }

    if (!session) {
        console.error("❌ No active session");
        return [];
    }

    const { data, error } = await supabase
        .from("user_annonces")
        .select(`annonce_id, user_id, status`)
        .eq("user_id", session.user.id);

    if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }

    // 🔥 Transforme les données pour ton écran
    const formatted = data.map((item, index) => ({
        id: item.annonce_id.toString(),
        annonceId: item.annonce_id,
        userId: item.user_id,
        status: item.status,
        type:
            item.status === StatusNotification.PENDING
                ? ("application" as const)
                : ("status" as const),
        message: getMessageByStatus(item.status),
        date: "Il y a 2h", // TODO : mettre la vraie date si tu l'ajoutes en BDD
    }));

    return formatted;
}

function getMessageByStatus(status: string) {
    switch (status) {
        case StatusNotification.PENDING:
            return "Un utilisateur a postulé à votre annonce 🚗";
        case StatusNotification.ACCEPTED:
            return "Votre candidature a été acceptée ✅";
        case StatusNotification.REJECTED:
            return "Votre candidature a été refusée ❌";
        default:
            return "Nouvelle notification";
    }
}
