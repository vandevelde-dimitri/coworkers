import { supabase } from "../../../utils/supabase";

export async function getUserRequest(annonceId: string, userId: string) {
    try {
        const { data, error } = await supabase
            .from("participant_requests")
            .select("*")
            .eq("annonce_id", annonceId)
            .eq("user_id", userId)
            .maybeSingle();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(
            "Erreur récupération de la demande de participation :",
            error,
        );
        throw error;
    }
}

export async function applyToAnnonce(annonceId: string, userId: string) {
    try {
        const { data, error } = await supabase
            .from("participant_requests")
            .insert({
                annonce_id: annonceId,
                user_id: userId,
                status: "pending",
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erreur lors de la candidature à l'annonce :", error);
        throw error;
    }
}

export async function cancelApplication(
    annonceId: string,
    userId: string,
    status?: string,
) {
    try {
        await supabase
            .from("participant_requests")
            .delete()
            .eq("annonce_id", annonceId)
            .eq("user_id", userId);

        if (status === "accepted") {
            const { data: conversation } = await supabase
                .from("conversations")
                .select("id")
                .eq("annonce_id", annonceId)
                .maybeSingle();

            if (conversation) {
                await supabase
                    .from("conversation_participants")
                    .delete()
                    .eq("conversation_id", conversation.id)
                    .eq("user_id", userId);
            }
        }
    } catch (error) {
        console.error("Erreur lors de l'annulation de la candidature :", error);
        throw error;
    }
}
