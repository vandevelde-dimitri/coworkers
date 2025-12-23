import { StatusNotification } from "./enum/statusNotification.enum";

export interface NotificationResponse {
    id: string;
    annonce_id: string;
    candidate_firstname: string;
    candidate_id: string;
    candidate_image: string | null;
    candidate_lastname: string;
    created_at: string;
    message: string;
    status: StatusNotification;
    annonce_title: string;
}
