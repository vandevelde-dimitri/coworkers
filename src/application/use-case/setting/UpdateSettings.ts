import { Settings } from "@/src/domain/entities/setting/Setting";
import { ISettingsRepository } from "@/src/domain/repositories/SettingRepository";

export class UpdateSettingsUseCase {
  constructor(private repository: ISettingsRepository) {}

  async execute(userId: string, updates: Partial<Settings>): Promise<void> {
    await this.repository.update(userId, updates);
  }
}
