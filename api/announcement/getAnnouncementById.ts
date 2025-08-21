import { AnnouncementWithUser } from "@/types/announcement.interface";
import { supabase } from "@/utils/supabase";

export async function getAnnouncementById(
    id: string
): Promise<AnnouncementWithUser> {
    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const userId = sessionData?.session?.user?.id;

    const { data: annonce, error } = await supabase
        .from("annonces")
        .select("*")
        .eq("id", id)
        .single();
    if (error) {
        console.error("Error fetching announcements:", error);
        throw error;
    }
    console.log(" ✅  Fetched announcements:", annonce);

    return annonce;
}
