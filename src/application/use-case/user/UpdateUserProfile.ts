import { UpdateUserPayload } from "../../../domain/entities/user/User";
import { IUserRepository } from "../../../domain/repositories/UserRepository";
import { logger } from "../../../utils/logger";

export class UpdateUserProfileUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(data: UpdateUserPayload): Promise<void> {
        try {
            await this.userRepo.updateUser(data);
        } catch (error) {
            const fields = Object.keys(data).join(", ");
            const userId = await this.userRepo.getCurrentSessionId();
            await logger.critical(
                "ERR_USR_UPDATE_PROFILE",
                `Échec de la mise à jour profil pour l'utilisateur, champs: ${fields}`,
                error,
                userId,
            );

            throw error;
        }
    }
}
