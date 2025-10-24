import { supabase } from "../../../utils/supabase";
import { AnnouncementWithUser } from "../../types/announcement.interface";

export async function getAllAnnouncementByFc(): Promise<
    AnnouncementWithUser[]
> {
    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const userId = sessionData?.session?.user?.id;

    const { data: annonces, error } = await supabase.rpc(
        "get_annonces_for_user",
        {
            p_user_id: userId,
        }
    );
    if (error) {
        console.error("Error fetching announcements:", error);
        throw error;
    }

    return annonces || [];
}
