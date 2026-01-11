import { supabase } from "../../../utils/supabase";
import {
    AnnonceDetail,
    ParticipantRequest,
} from "../../types/announcement.interface";

export async function getAnnouncementById(
    annonce_id: string
): Promise<AnnonceDetail> {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

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
    contract
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
        contract
    )
  )
`
        )
        .eq("id", annonce_id)
        .single();

    if (error) {
        console.error("Error fetching announcement:", error);
        throw error;
    }

    const myRequest = annonce.participant_requests.find(
        (r: ParticipantRequest) => r.user_id === data.session?.user.id
    );

    return { ...annonce, myStatus: myRequest?.status ?? null };
}
