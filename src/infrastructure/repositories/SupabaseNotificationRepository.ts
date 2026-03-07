import { Notification } from "@/src/domain/entities/notification/Notification";
import { INotificationRepository } from "@/src/domain/repositories/NotificationRepository";
import { supabase } from "../supabase";

export class SupabaseNotificationRepository implements INotificationRepository {
  async getAllNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase.rpc("get_combined_notifications");

    console.log("request notification => ", data);

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      annonceId: item.annonce_id,
      annonceTitle: item.annonce_title,
      userId: item.other_user_id,
      status: item.status,
      scope: item.scope,
      createdAt: item.created_at,
      userName: `${item.firstname} ${item.lastname}`,
      profileAvatar: item.image_profile,
      message: this.generateMessage(item),
      avatarUpdatedAt: item.avatar_updated_at,
    }));
  }

  private generateMessage(item: any): string {
    if (item.scope === "owner") {
      return `${item.firstname} souhaite rejoindre votre annonce "${item.annonce_title}"`;
    }

    // Pour le candidat
    switch (item.status) {
      case "accepted":
        return `Félicitations ! Votre demande pour "${item.annonce_title}" est acceptée.`;
      case "refused":
        return `Votre demande pour "${item.annonce_title}" a malheureusement été refusée.`;
      default:
        return `Mise à jour de statut pour l'annonce "${item.annonce_title}".`;
    }
  }
}
