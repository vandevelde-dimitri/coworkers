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
    // 1️⃣ Retirer de la conversation
    await supabase
        .from("conversation_participants")
        .delete()
        .eq("conversation_id", conversationId)
        .eq("user_id", participantId);

    // 2️⃣ Marquer la candidature comme supprimée
    await supabase
        .from("participant_requests")
        .update({ status: "refused" })
        .eq("annonce_id", annonceId)
        .eq("user_id", participantId);

    // 3️⃣ Rendre la place
    await supabase.rpc("increment_places", { annonce: annonceId });
}
