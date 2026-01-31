import { supabase } from "../../../utils/supabase";
import { AnnouncementWithUser } from "../../types/announcement.interface";

export async function getAllAnnouncementByFc(
    page: number,
    pageSize: number = 5,
    fc_id?: string | null,
): Promise<{ data: AnnouncementWithUser[]; totalCount: number }> {
    const cleanFcId = fc_id === "all" ? null : fc_id;

    const { data, error } = await supabase.rpc("get_annonces_for_user", {
        p_fc_id: cleanFcId,
        p_limit: pageSize,
        p_offset: (page - 1) * pageSize,
    });

    if (error) {
        if (__DEV__) console.error("getAllAnnouncementByFc error:", error);
    }

    return {
        data: (data as AnnouncementWithUser[]) || [],
        totalCount: data && data.length > 0 ? data[0].total_count : 0,
    };
}
