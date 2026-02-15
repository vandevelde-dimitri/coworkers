import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";

export class RegisterUseCase {
    constructor(private authRepo: IAuthRepository) {}

    async execute(email: string, password: string): Promise<void> {
        await this.authRepo.register(email, password);
    }
}
