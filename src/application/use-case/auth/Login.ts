import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";

export class LoginUseCase {
    constructor(private authRepo: IAuthRepository) {}

    async execute(email: string, password: string): Promise<void> {
        await this.authRepo.login(email, password);
    }
}
