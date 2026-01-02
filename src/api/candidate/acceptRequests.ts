import { supabase } from "../../../utils/supabase";

export async function AcceptRequest(candidate_id: string, annonce_id: string) {
    const { data, error } = await supabase
        .from("participant_requests")
        .update({ status: "accepted" })
        .eq("annonce_id", annonce_id)
        .eq("user_id", candidate_id)
        .select("id")
        .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Candidature introuvable");

    return data;
}
