import { Settings } from "@/src/domain/entities/setting/Setting";
import { ISettingsRepository } from "@/src/domain/repositories/SettingRepository";

export class GetSettingsUseCase {
  constructor(private repository: ISettingsRepository) {}

  async execute(): Promise<Settings> {
    return await this.repository.getSettings();
  }
}
