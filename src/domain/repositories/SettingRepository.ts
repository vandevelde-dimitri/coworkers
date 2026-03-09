import { Settings } from "../entities/setting/Setting";

export interface ISettingsRepository {
  getSettings(): Promise<Settings>;
  update(userId: string, updates: Partial<Settings>): Promise<void>;
}
