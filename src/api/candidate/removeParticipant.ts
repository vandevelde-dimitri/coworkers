import { supabase } from "../../../utils/supabase";

export async function removeParticipant({
    annonceId,
    participantId,
    conversationId,
}: {
    annonceId: string;
    participantId: string;
    conversationId: string;
}) {
    try {
        const { error } = await supabase.rpc("remove_participant", {
            p_annonce_id: annonceId,
            p_participant_id: participantId,
            p_conversation_id: conversationId,
        });

        if (error) throw error;
    } catch (error) {
        if (__DEV__) console.error("removeParticipant error:", error);
        throw error;
    }
}
