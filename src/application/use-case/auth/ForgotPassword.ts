import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";

export class ForgotPasswordUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(email: string, redirectTo: string): Promise<void> {
    this.validateEmail(email);

    await this.authRepo.resetPasswordEmail(email, redirectTo);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("email_address_invalid");
    }
  }
}
