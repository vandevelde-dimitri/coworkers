import { supabase } from "@/src/infrastructure/supabase";
import { uriToArrayBuffer } from "@/utils/uriToArrayBuffer";
import {
  UpdateUserPayload,
  User,
  UserPublic,
} from "../../domain/entities/user/User";
import { IUserRepository } from "../../domain/repositories/UserRepository";
import { UserMapper } from "../mappers/UserMapper";

export class SupabaseUserRepository implements IUserRepository {
  private static instance: SupabaseUserRepository;

  private constructor() {}

  static getInstance(): SupabaseUserRepository {
    if (!SupabaseUserRepository.instance) {
      SupabaseUserRepository.instance = new SupabaseUserRepository();
    }
    return SupabaseUserRepository.instance;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select(
        `*,
         fc:fc_id ( id, name )`,
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      if (__DEV__) console.error("Erreur récupération utilisateur", error);
      throw error;
    }

    return data ? UserMapper.toDomain(data) : null;
  }

  async getUserProfilePublic(userId: string): Promise<UserPublic | null> {
    const { data, error } = await supabase
      .from("public_profiles")
      .select(
        `*,
         fc:fc_id ( id, name )`,
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      if (__DEV__)
        console.error("Erreur récupération profil public utilisateur");
      throw error;
    }

    return data ? UserMapper.toDomainPublic(data) : null;
  }

  async getCurrentSessionId(): Promise<string | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  }

  async updateUser(data: UpdateUserPayload): Promise<void> {
    const userId = await this.getCurrentSessionId();
    if (!userId) throw new Error("Session introuvable.");

    const persistenceData = UserMapper.toPersistence(data);

    const { error } = await supabase
      .from("users")
      .update(persistenceData)
      .eq("id", userId);

    if (error) throw error;
  }

  async updateImageProfile(avatarUrl: string): Promise<void> {
    const userId = await this.getCurrentSessionId();
    if (!userId) throw new Error("Session introuvable.");

    const { error } = await supabase
      .from("users")
      .update({
        image_profile: avatarUrl,
        avatar_updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
  }

  async deleteAvatar(): Promise<void> {
    const userId = await this.getCurrentSessionId();
    if (!userId) throw new Error("Session introuvable.");

    const { error } = await supabase
      .from("users")
      .update({
        image_profile: null,
        avatar_updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
  }

  async uploadAvatar(avatarFile: string): Promise<string> {
    const userId = await this.getCurrentSessionId();
    if (!userId) throw new Error("Session introuvable.");

    const filePath = `${userId}/avatar.webp`;
    const arrayBuffer = await uriToArrayBuffer(avatarFile);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, arrayBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async deleteAccount(): Promise<void> {
    const { data, error } = await supabase.functions.invoke("delete-account", {
      method: "POST",
    });

    if (error) throw error;
  }
}
