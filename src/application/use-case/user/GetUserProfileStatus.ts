import { IUserRepository } from "@/src/domain/repositories/UserRepository";

export class GetUserProfileStatusUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<boolean> {
    return await this.userRepository.getUserProfileStatus();
  }
}
