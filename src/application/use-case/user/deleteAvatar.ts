import { logger } from "@/utils/logger";
import { IUserRepository } from "../../../domain/repositories/UserRepository";

export class DeleteAvatarUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(): Promise<void> {
    try {
      await this.userRepo.deleteAvatar();
    } catch (error) {
      const userId = await this.userRepo.getCurrentSessionId();
      await logger.critical(
        "ERR_USR_DELETE_AVATAR",
        `Échec de la suppression avatar pour l'utilisateur`,
        error,
        userId,
      );

      throw error;
    }
  }
}
