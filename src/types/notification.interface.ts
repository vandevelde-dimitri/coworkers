import { StatusNotification } from "./enum/statusNotification.enum";

export interface Notification {
    id: string;
    annonceId: string;
    userId: string;
    status: StatusNotification; // enum
    type: "application" | "status";
    message: string;
    date: string;
}
