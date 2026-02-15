import { User, UserPublic } from "../../../domain/entities/user/User";
import { IUserRepository } from "../../../domain/repositories/UserRepository";

export class GetUserProfile {
    constructor(private userRepo: IUserRepository) {}

    async execute(targetUserId?: string): Promise<User | UserPublic | null> {
        const authId = await this.userRepo.getCurrentSessionId();

        if (!targetUserId || targetUserId === authId) {
            return this.userRepo.getUserById(authId!);
        }

        return this.userRepo.getUserProfilePublic(targetUserId);
    }
}
