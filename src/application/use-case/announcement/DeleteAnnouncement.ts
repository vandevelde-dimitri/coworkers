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
      const userId = await this.userRepo.getCurrentSessionId();
      if (!userId) throw new UnauthorizedError();

      const announcement =
        await this.announcementRepo.getAnnouncementById(announcementId);
      if (!announcement) throw new Error("Annonce non trouvée");

      if (announcement.owner.id !== userId) {
        throw new UnauthorizedError(
          "Vous n'êtes pas le propriétaire de cette annonce",
        );
      }

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
