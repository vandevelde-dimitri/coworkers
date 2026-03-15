import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";

export class LoginUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(email: string, password: string): Promise<void> {
    this.validateEmail(email);
    this.validatePassword(password);

    await this.authRepo.login(email, password);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("email_address_invalid");
    }
  }

  private validatePassword(password: string): void {
    if (!password || password.length < 1) {
      throw new Error("password_required");
    }

    // Optionnel : Une sécurité de base (ex: < 8) mais JAMAIS de Regex complexe ici.
    if (password.length < 8) {
      throw new Error("invalid_credentials");
    }
  }
}
