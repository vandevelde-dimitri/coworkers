import { supabase } from "../../../utils/supabase";

export async function getAllCandidate(): Promise<CandidateResponse[]> {
    // 🔹 Récupération session
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
        console.error("❌ Session error:", sessionError);
        return [];
    }

    // 🔹 Requête candidats
    const { data, error } = await supabase
        .from("participant_requests")
        .select(`*,`)
        .eq("user_id", session.user.id);

    if (error) {
        console.error("Error fetching candidates:", error);
        throw error;
    }
    console.log("✅ candidates", data);

    // 🔹 Transformation pour l’écran
    const formatted: CandidateResponse[] = (data ?? []).map(
        (item: CandidateResponse) => {
            return {
                id: item.id,
                firstname: item.firstname,
                lastname: item.lastname,
                email: item.email,
                phone: item.phone,
                resume_url: item.resume_url,
                created_at: item.created_at,
            };
        }
    );
    return formatted;
}
