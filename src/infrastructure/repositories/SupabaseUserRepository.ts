import { supabase } from "@/utils/supabase";
import { uriToArrayBuffer } from "@/utils/uriToArrayBuffer";
import {
    UpdateUserPayload,
    User,
    UserPublic,
} from "../../domain/entities/user/User";
import { IUserRepository } from "../../domain/repositories/UserRepository";
import { UserMapper } from "../mappers/UserMapper";

export class SupabaseUserRepository implements IUserRepository {
    async getUserById(id: string): Promise<User | null> {
        const { data, error } = await supabase
            .from("users")
            .select(
                `*,
                fc:fc_id ( 
                id,
            name
          )`,
            )
            .eq("id", id)
            .single();

        if (error) {
            if (__DEV__)
                console.error("Erreur récupération utilisateur", error);
            throw error;
        }

        return UserMapper.toDomain(data);
    }

    async getUserProfilePublic(userId: string): Promise<UserPublic | null> {
        const { data, error: errorUser } = await supabase
            .from("public_profiles")
            .select(
                `*,
                fc:fc_id ( 
                id,
            name
          )`,
            )
            .eq("id", userId)
            .single();

        if (errorUser) {
            if (__DEV__)
                console.error("Erreur récupération profil public utilisateur");
            throw errorUser;
        }

        return UserMapper.toDomainPublic(data);
    }

    async getCurrentSessionId(): Promise<string | null> {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        return user?.id || null;
    }

    async updateUser(data: UpdateUserPayload): Promise<void> {
        const userId = await this.getCurrentSessionId();

        if (!userId) {
            throw new Error(
                "Impossible de mettre à jour le profil : session introuvable.",
            );
        }

        const persistenceData = UserMapper.toPersistence(data);

        const { error } = await supabase
            .from("users")
            .update(persistenceData)
            .eq("id", userId);

        if (error) {
            if (__DEV__) {
                console.error(
                    `[ERR_USR_UPDATE_PROFILE] ❌ Erreur Supabase:`,
                    error.message,
                );
            }
            throw error;
        }
    }

    async deleteUser(userId: string): Promise<void> {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", userId);

        if (error) {
            if (__DEV__)
                console.error("Erreur suppression utilisateur:", error);
            throw error;
        }
    }

    async updateImageProfile(avatarUrl: string): Promise<void> {
        const userId = await this.getCurrentSessionId();

        if (!userId) {
            throw new Error(
                "Impossible de mettre à jour la photo de profil : session introuvable.",
            );
        }

        const { error } = await supabase
            .from("users")
            .update({ image_profile: avatarUrl, avatar_updated_at: new Date() })
            .eq("id", userId)
            .select();
        if (error) {
            if (__DEV__)
                console.error("Erreur mise à jour avatar utilisateur:", error);
            throw error;
        }
    }

    async uploadAvatar(avatarFile: string): Promise<string> {
        const userId = await this.getCurrentSessionId();

        if (!userId) {
            throw new Error(
                "Impossible de télécharger l'avatar : session introuvable.",
            );
        }
        const fileExt = "webp";
        const filePath = `${userId}/avatar.${fileExt}`;
        const arrayBuffer = await uriToArrayBuffer(avatarFile);

        try {
            const { error } = await supabase.storage
                .from("avatars")
                .upload(filePath, arrayBuffer, {
                    contentType: "image/webp",
                    upsert: true,
                });
            if (error) {
                if (__DEV__)
                    console.error("Erreur upload avatar utilisateur:", error);
                throw error;
            }
            const { data: publicUrlData } = await supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            return publicUrlData.publicUrl;
        } catch (error) {
            if (__DEV__)
                console.error("Erreur upload avatar utilisateur:", error);
            throw error;
        }
    }
}
