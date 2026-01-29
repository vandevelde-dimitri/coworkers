import { supabase } from "../../../utils/supabase";
import { AnnouncementWithUser } from "../../types/announcement.interface";

export async function getAllAnnouncementByFc(
    page: number,
    pageSize: number = 5,
    fc_id?: string | null,
): Promise<{ data: AnnouncementWithUser[]; totalCount: number }> {
    const { data, error } = await supabase.rpc("get_annonces_for_user", {
        p_fc_id: fc_id ? fc_id : null,
        p_limit: pageSize,
        p_offset: (page - 1) * pageSize,
    });

    if (error) console.log(error);

    return {
        data: (data as AnnouncementWithUser[]) || [],
        totalCount: data && data.length > 0 ? data[0].total_count : 0,
    };
}
