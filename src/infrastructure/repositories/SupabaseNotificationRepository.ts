import { Notification } from "@/src/domain/entities/notification/Notification";
import { INotificationRepository } from "@/src/domain/repositories/NotificationRepository";
import { supabase } from "../supabase";
import { NotificationMapper } from "../mappers/NotificationMapper";

export class SupabaseNotificationRepository implements INotificationRepository {
  async getAllNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase.rpc("get_combined_notifications");

    if (error) throw error;

    return data.map((item: any) => NotificationMapper.toDomain(item));
  }
}
