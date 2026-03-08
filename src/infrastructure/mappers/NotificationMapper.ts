import { Notification } from "@/src/domain/entities/notification/Notification";

export class NotificationMapper {
  static toDomain(raw: any): Notification {
    return {
      id: raw.id,
      annonceId: raw.annonce_id,
      annonceTitle: raw.annonce_title,
      otherUserId: raw.other_user_id,
      status: raw.status,
      scope: raw.scope,
      createdAt: raw.created_at,
      userName: `${raw.firstname} ${raw.lastname}`,
      profileAvatar: raw.image_profile,
      message: this.generateMessage(raw),
      avatarUpdatedAt: raw.avatar_updated_at,
    };
  }

  private static generateMessage(item: any): string {
    if (item.scope === "owner") {
      switch (item.status) {
        case "accepted":
          return `Vous avez accepté la demande de ${item.firstname} pour "${item.annonce_title}".`;
        case "refused":
          return `Vous avez refusé la demande de ${item.firstname} pour "${item.annonce_title}".`;
        case "pending":
          return `${item.firstname} souhaite rejoindre votre annonce "${item.annonce_title}".`;
        default:
          return `Demande de ${item.firstname} pour "${item.annonce_title}".`;
      }
    }

    switch (item.status) {
      case "accepted":
        return `Félicitations ! Votre demande pour "${item.annonce_title}" est acceptée.`;
      case "refused":
        return `Votre demande pour "${item.annonce_title}" a malheureusement été refusée.`;
      case "announce_deleted":
        return `L'annonce "${item.annonce_title}" a été supprimée.`;
      case "removed_by_owner":
        return `Vous avez été retiré de l'annonce "${item.annonce_title}".`;
      default:
        return `Mise à jour de statut pour l'annonce "${item.annonce_title}".`;
    }
  }
}
