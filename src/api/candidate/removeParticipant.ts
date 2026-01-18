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
    const { error } = await supabase.rpc("remove_participant", {
        p_annonce_id: annonceId,
        p_participant_id: participantId,
        p_conversation_id: conversationId,
    });

    if (error) {
        console.error("RPC remove_participant error:", error);
        throw error;
    }
}
