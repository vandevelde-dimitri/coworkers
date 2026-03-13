import { Settings } from "@/src/domain/entities/setting/Setting";
import { ISettingsRepository } from "@/src/domain/repositories/SettingRepository";
import { SettingsMapper } from "../mappers/SettingMapper";
import { supabase } from "../supabase";

export class SupabaseSettingsRepository implements ISettingsRepository {
  private static instance: SupabaseSettingsRepository;

  private constructor() {}

  static getInstance(): SupabaseSettingsRepository {
    if (!SupabaseSettingsRepository.instance) {
      SupabaseSettingsRepository.instance = new SupabaseSettingsRepository();
    }
    return SupabaseSettingsRepository.instance;
  }

  async getSettings(): Promise<Settings> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      throw new Error(
        "Impossible de récupérer les paramètres : session introuvable.",
      );
    }

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      return SettingsMapper.toDomain(data);
    }

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    const defaultSettings = {
      user_id: user.id,
      notification_push: true,
      vibrations: false,
      to_convey: false,
      available: false,
    };

    const { data: createdData, error: createError } = await supabase
      .from("settings")
      .insert(defaultSettings)
      .select("*")
      .single();

    if (createError) throw createError;

    return SettingsMapper.toDomain(createdData);
  }

  async update(userId: string, updates: Partial<Settings>): Promise<void> {
    if (!userId) {
      throw new Error(
        "Impossible de mettre à jour les paramètres : userId manquant.",
      );
    }

    const { error } = await supabase
      .from("settings")
      .update(SettingsMapper.toPersistence(updates))
      .eq("user_id", userId);

    if (error) throw error;
  }
}
