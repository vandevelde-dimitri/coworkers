import { supabase } from "../../../utils/supabase";

export async function AcceptRequest(candidate_id: string, annonce_id: string) {
    try {
        const { error } = await supabase.rpc("accept_candidate", {
            p_annonce_id: annonce_id,
            p_candidate_id: candidate_id,
        });

        if (error) throw error;
    } catch (error) {
        if (__DEV__) console.error("AcceptRequest error:", error);
        throw error;
    }
}
