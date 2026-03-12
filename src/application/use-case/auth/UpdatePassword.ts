import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";

export class UpdatePasswordUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(password: string): Promise<void> {
    await this.authRepo.updatePassword(password);
  }
}
