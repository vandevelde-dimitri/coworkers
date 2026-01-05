import { supabase } from "../../../utils/supabase";
import { AnnouncementDetail } from "../../types/announcement.interface";

export async function getAnnouncementById(
    id: string
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

//! se que je voudrais
/*
export async function getAnnouncementById(
    id: string
): Promise<AnnouncementDetail> {
    const { error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const { data: annonce, error } = await supabase
        .from("annonces")
        .select(`
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
            ),
            participants:participant_requests (
                id,
                status,
                user:users (
                    id,
                    firstname,
                    image_profile
                )
            )
        `)
        .eq("id", id)
        .eq("participants.status", "accepted") // 🔥 seulement les acceptés
        .single();

    if (error) {
        console.error("Error fetching announcement:", error);
        throw error;
    }

    return annonce;
}
*/
