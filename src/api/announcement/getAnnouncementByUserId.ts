import { supabase } from "../../../utils/supabase";
import { AnnouncementDetail } from "../../types/announcement.interface";

export async function getAnnouncementByUserId(
    user_id: string,
): Promise<AnnouncementDetail> {
    const { error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const { data: annonce, error } = await supabase
        .from("annonces")
        .select(
            `
    *,
    users:users (
      firstname,
      image_profile,
      contract,
      team,
      city,
      to_convey,
      fc:fc_id ( 
        name
      )
    )
  `,
        )
        .eq("user_id", user_id)
        .single();
    if (error) {
        if (__DEV__) console.error("Error fetching announcement:", error);
        throw error;
    }

    return annonce;
}
