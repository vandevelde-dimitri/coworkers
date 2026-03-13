import { Announcement } from "@/src/domain/entities/announcement/Announcement";
import { supabase } from "@/src/infrastructure/supabase";
import { IFavoriteRepository } from "../../domain/repositories/FavoriteRepository";
import { AnnouncementListMapper } from "../mappers/AnnouncementListMapper";

export class SupabaseFavoriteRepository implements IFavoriteRepository {
  private static instance: SupabaseFavoriteRepository;

  private constructor() {}

  static getInstance(): SupabaseFavoriteRepository {
    if (!SupabaseFavoriteRepository.instance) {
      SupabaseFavoriteRepository.instance = new SupabaseFavoriteRepository();
    }
    return SupabaseFavoriteRepository.instance;
  }

  async getFavoriteStatus(userId: string, annonceId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("user_annonces")
      .select("favorite")
      .eq("user_id", userId)
      .eq("annonce_id", annonceId)
      .maybeSingle();

    if (error) throw error;

    return !!data?.favorite;
  }

  async toggleFavorite(
    userId: string,
    annonceId: string,
    value: boolean,
  ): Promise<void> {
    const { error } = await supabase.from("user_annonces").upsert(
      [
        {
          user_id: userId,
          annonce_id: annonceId,
          favorite: value,
        },
      ],
      { onConflict: "user_id,annonce_id" },
    );

    if (error) throw error;
  }

  async getFavoriteAnnouncements(
    page: number,
    pageSize: number,
  ): Promise<{ announcements: Announcement[]; totalCount: number }> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return { announcements: [], totalCount: 0 };

    const { data, error } = await supabase.rpc("get_favorite_annonces", {
      p_user_id: user.id,
      p_limit: pageSize,
      p_offset: (page - 1) * pageSize,
    });

    if (error) throw error;

    const totalCount = data && data.length > 0 ? data[0].total_count : 0;

    const announcements = (data || []).map((raw: any) =>
      AnnouncementListMapper.toDomain(raw),
    );

    return {
      announcements: announcements,
      totalCount: Number(totalCount),
    };
  }
}
