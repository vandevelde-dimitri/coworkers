import { supabase } from "../../../utils/supabase";
import { AnnonceDetail } from "../../types/announcement.interface";

export async function getAnnouncementByCurrentUser(): Promise<AnnonceDetail> {
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
    owner:users (
      id,
      firstname,
      image_profile,
      city,
        avatar_updated_at,
        contract,
        settings:settings!user_id (to_convey)
    ),
    participant_requests (
      id,
      status,
      user_id,
      users (
        id,
        firstname,
        image_profile,
        city,
        avatar_updated_at,
        contract,
        settings:settings!user_id (to_convey)
      )
    )
  `,
        )
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching announcement:", error);
        throw error;
    }

    return annonce;
}
