import { supabase } from "../../../utils/supabase";

interface CandidateResponse {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    resume_url: string;
    created_at: string;
}

export async function getAllCandidate(): Promise<CandidateResponse[]> {
    try {
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError || !session) {
            if (__DEV__) console.error("Session error:", sessionError);
            return [];
        }

        const { data, error } = await supabase
            .from("participant_requests")
            .select(`*`)
            .eq("user_id", session.user.id);

        if (error) {
            throw error;
        }

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
            },
        );
        return formatted;
    } catch (error) {
        if (__DEV__) console.error("getAllCandidate error:", error);
        throw error;
    }
}
