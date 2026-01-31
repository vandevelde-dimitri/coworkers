import { supabase } from "../../../utils/supabase";
import { AnnouncementWithUser } from "../../types/announcement.interface";

export async function getAllAnnouncementFavorite(
    page: number,
    pageSize: number = 5,
): Promise<{ data: AnnouncementWithUser[]; totalCount: number }> {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return { data: [], totalCount: 0 };

    const {
        data: userAnnonces,
        count,
        error: countError,
    } = await supabase
        .from("user_annonces")
        .select("annonce_id", { count: "exact" })
        .eq("user_id", userId)
        .eq("favorite", true)
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (countError) throw countError;
    if (!userAnnonces || userAnnonces.length === 0)
        return { data: [], totalCount: 0 };

    const { data: annonces, error: detailError } = await supabase
        .from("annonces")
        .select(
            `
            id, title, content, date_start, date_end, number_of_places, user_id,
            users (
                firstname, 
                image_profile, 
                contract, 
                team, 
                city, 
                to_convey, 
                avatar_updated_at,
                fc:fc_id (name)
            )
        `,
        )
        .in(
            "id",
            userAnnonces.map((ua) => ua.annonce_id),
        );

    if (detailError) throw detailError;

    return {
        data: (annonces as any) || [],
        totalCount: count || 0,
    };
}

export async function getFavoriteStatus(
    userId: string,
    annonceId: string,
): Promise<boolean> {
    const { data, error } = await supabase
        .from("user_annonces")
        .select("favorite")
        .eq("user_id", userId)
        .eq("annonce_id", annonceId)
        .maybeSingle();

    if (error) throw error;

    return !!data?.favorite;
}

export async function toggleFavorite(
    userId: string,
    annonceId: string,
    value: boolean,
) {
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
