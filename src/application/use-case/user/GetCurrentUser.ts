import { User } from "@/src/domain/entities/user/User";
import { IUserRepository } from "@/src/domain/repositories/UserRepository";

export class GetCurrentUser {
    constructor(private userRepo: IUserRepository) {}

    async execute(): Promise<User | null> {
        const authId = await this.userRepo.getCurrentSessionId();

        if (!authId) {
            return null;
        }

        return this.userRepo.getUserById(authId);
    }
}
