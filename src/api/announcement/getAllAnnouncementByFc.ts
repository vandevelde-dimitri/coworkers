import { supabase } from "../../../utils/supabase";
import { AnnouncementWithUser } from "../../types/announcement.interface";

// getAllAnnouncementByFc.ts
export async function getAllAnnouncementByFc(
    page: number,
    pageSize: number = 5
): Promise<{ data: AnnouncementWithUser[]; totalCount: number }> {
    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const userId = sessionData?.session?.user?.id;

    const { data, error } = await supabase.rpc("get_annonces_for_user", {
        p_user_id: userId ?? null,
        p_limit: pageSize,
        p_offset: (page - 1) * pageSize,
    });

    if (error) throw error;

    return {
        data: (data as AnnouncementWithUser[]) || [],
        totalCount: data && data.length > 0 ? data[0].total_count : 0,
    };
}
