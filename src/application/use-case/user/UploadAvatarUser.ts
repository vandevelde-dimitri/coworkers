import { IUserRepository } from "../../../domain/repositories/UserRepository";
import { convertToWebp } from "../../../utils/convertToWebp";
import { logger } from "../../../utils/logger";

export class UpdateAvatarUserUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(avatarFile: string): Promise<void> {
        try {
            const imageWebp = await convertToWebp(avatarFile);

            const avatarUrl = await this.userRepo.uploadAvatar(imageWebp);

            await this.userRepo.updateImageProfile(avatarUrl);
        } catch (error) {
            // if (__DEV__)
            console.error("Erreur lors de la mise à jour de l'avatar", error);
            const userId = await this.userRepo.getCurrentSessionId();
            logger.critical(
                "ERR_USR_UPDATE_AVATAR",
                "Mise à jour de l'avatar utilisateur",
                error,
                userId,
            );
            throw error;
        }
    }
}
