import { Notification } from "@/src/domain/entities/notification/Notification";
import { INotificationRepository } from "@/src/domain/repositories/NotificationRepository";
import { NotificationMapper } from "../mappers/NotificationMapper";
import { supabase } from "../supabase";

export class SupabaseNotificationRepository implements INotificationRepository {
  private static instance: SupabaseNotificationRepository;

  private constructor() {}

  static getInstance(): SupabaseNotificationRepository {
    if (!SupabaseNotificationRepository.instance) {
      SupabaseNotificationRepository.instance =
        new SupabaseNotificationRepository();
    }
    return SupabaseNotificationRepository.instance;
  }

  async getAllNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase.rpc("get_combined_notifications");

    if (error) {
      if (__DEV__) console.error("Erreur notification RPC:", error);
      throw error;
    }

    return (data || []).map((item: any) => NotificationMapper.toDomain(item));
  }
}
