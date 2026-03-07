import { Notification } from "../entities/notification/Notification";

export interface INotificationRepository {
  getAllNotifications(): Promise<Notification[]>;
}
