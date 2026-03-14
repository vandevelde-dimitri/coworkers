import { logger } from "@/utils/logger";
import { UnauthorizedError } from "../../../domain/errors/AppError";
import { IAnnouncementRepository } from "../../../domain/repositories/AnnouncementRepository";
import { IUserRepository } from "../../../domain/repositories/UserRepository";

export class DeleteAnnouncementUseCase {
  constructor(
    private announcementRepo: IAnnouncementRepository,
    private userRepo: IUserRepository,
  ) {}

  async execute(announcementId: string): Promise<void> {
    try {
      // Récupérer l'ID utilisateur connecté
      const userId = await this.userRepo.getCurrentSessionId();
      if (!userId) throw new UnauthorizedError();

      // Récupérer l'annonce
      const announcement =
        await this.announcementRepo.getAnnouncementById(announcementId);
      if (!announcement) throw new Error("Annonce non trouvée");

      // Vérifier que l'utilisateur est bien le propriétaire
      if (announcement.owner.id !== userId) {
        throw new UnauthorizedError(
          "Vous n'êtes pas le propriétaire de cette annonce",
        );
      }

      // Supprimer seulement si autorisé
      await this.announcementRepo.deleteAnnouncement(announcementId);
    } catch (error) {
      await logger.critical(
        "ERR_ANN_DELETE",
        `Suppression d'une annonce => ${announcementId}`,
        error,
      );
      throw error;
    }
  }
}
