import { Announcement } from "@/types/announcement.interface";
import { supabase } from "@/utils/supabase";

export async function getAllAnnouncementByFc(): Promise<Announcement[]> {
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
    console.log(" ✅  Fetched announcements:", annonces);

    return annonces || [];
}
