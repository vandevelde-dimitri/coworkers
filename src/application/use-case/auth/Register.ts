import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";

export class RegisterUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(email: string, password: string): Promise<void> {
    this.validateEmail(email);
    this.validatePassword(password);

    await this.authRepo.register(email, password);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("email_address_invalid");
    }
  }

  private validatePassword(password: string): void {
    // Regex : 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial, 8+ caractères
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      throw new Error("weak_password");
    }
  }
}
