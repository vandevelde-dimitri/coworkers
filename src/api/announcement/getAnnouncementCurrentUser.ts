import { supabase } from "../../../utils/supabase";
import { AnnouncementDetail } from "../../types/announcement.interface";

export async function getAnnouncementByCurrentUser(): Promise<AnnouncementDetail> {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
        throw new Error("Utilisateur non authentifié");
    }

    const userId = session.user.id;

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
  `
        )
        .eq("user_id", userId)
        .maybeSingle();
    if (error) {
        console.error("Error fetching announcement:", error);
        throw error;
    }

    return annonce;
}
