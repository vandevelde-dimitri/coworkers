import { AnnouncementDetail } from "@/types/announcement.interface";
import { supabase } from "@/utils/supabase";

export async function getAnnouncementById(
    id: string
): Promise<AnnouncementDetail> {
    const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const userId = sessionData?.session?.user?.id;

    const { data: annonce, error } = await supabase
        .from("annonces")
        .select(
            `
      *,
      users:users (
        firstname
      )
    `
        )
        .eq("id", id)
        .single();
    if (error) {
        console.error("Error fetching announcement:", error);
        throw error;
    }

    return annonce;
}
