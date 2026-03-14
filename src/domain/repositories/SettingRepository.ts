import { Settings } from "../entities/setting/Setting";

export interface ISettingsRepository {
  getSettings(): Promise<Settings>;
  update(updates: Partial<Settings>): Promise<void>;
}
