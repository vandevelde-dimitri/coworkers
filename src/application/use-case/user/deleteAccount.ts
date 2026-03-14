import { IUserRepository } from "@/src/domain/repositories/UserRepository";

export class DeleteAccountUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<void> {
    return await this.userRepository.deleteAccount();
  }
}
