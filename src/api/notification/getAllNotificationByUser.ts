import { supabase } from "../../../utils/supabase";
import { StatusNotification } from "../../types/enum/statusNotification.enum";
import { NotificationResponse } from "../../types/notification.interface";

export async function getAllNotificationByUser(): Promise<
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

        const { data, error } = await supabase.rpc("get_my_notifications");

        if (error) {
            if (__DEV__) console.error("Error fetching notifications:", error);
            throw error;
        }

        const formatted: NotificationResponse[] = (data ?? [])
            .filter((item: any) => item.status === StatusNotification.PENDING)
            .map((item: NotificationResponse) => {
                const user = {
                    firstname: item.candidate_firstname,
                    lastname: item.candidate_lastname,
                };

                return {
                    id: item.id,
                    annonceId: item.annonce_id,
                    annonceTitle: item.annonce_title,
                    user_id: item.candidate_id,
                    status: item.status,
                    candidate_firstname: item.candidate_firstname,
                    candidate_lastname: item.candidate_lastname,
                    image_profile: item.candidate_image,
                    avatar_updated_at: item.created_at,
                    message: getMessageByStatus(
                        item.status,
                        item.annonce_title,
                        user,
                    ),
                    created_at: item.created_at,
                };
            });

        return formatted;
    } catch (error) {
        if (__DEV__) console.error("getAllNotificationByUser error:", error);
        throw error;
    }
}

function getMessageByStatus(
    status: string,
    annonce_title: string,
    user: { firstname: string; lastname: string },
) {
    if (status === StatusNotification.PENDING) {
        return `${user.firstname} souhaite rejoindre votre activité "${annonce_title}"`;
    }
    return "Notification archivée"; // Au cas où
}
