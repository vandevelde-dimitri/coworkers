import { IApplicationRepository } from "@/src/domain/repositories/ApplicationRepository";

export class GetUserApplicationsUseCase {
  constructor(private repository: IApplicationRepository) {}

  async execute() {
    return await this.repository.getUserApplications();
  }
}
