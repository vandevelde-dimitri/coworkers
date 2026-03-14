import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";

export interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  specialChar: boolean;
}

export class RegisterUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(email: string, password: string): Promise<void> {
    this.validateEmail(email);

    const criteria = this.getPasswordCriteria(password);
    if (!Object.values(criteria).every(Boolean)) {
      throw new Error("weak_password");
    }

    await this.authRepo.register(email, password);
  }

  public getPasswordCriteria(password: string): PasswordCriteria {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[\W_]/.test(password),
    };
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("email_address_invalid");
    }
  }
}
