import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";

export class UpdateEmailUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(email: string): Promise<void> {
    await this.authRepo.updateEmail(email);
  }
}
