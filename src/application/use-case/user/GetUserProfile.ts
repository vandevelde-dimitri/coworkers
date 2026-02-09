import { User, UserPublic } from "../../../domain/entities/user/User";
import { IUserRepository } from "../../../domain/repositories/UserRepository";

export class GetUserProfile {
    constructor(private userRepo: IUserRepository) {}

    async execute(targetUserId?: string): Promise<User | UserPublic | null> {
        const authId = await this.userRepo.getCurrentSessionId();

        // CAS 1 : C'est moi (ou je n'ai pas précisé d'ID)
        if (!targetUserId || targetUserId === authId) {
            return this.userRepo.getUserById(authId!);
        }

        // CAS 2 : C'est quelqu'un d'autre
        return this.userRepo.getUserProfilePublic(targetUserId);
    }
}
