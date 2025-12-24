import { supabase } from "../../../utils/supabase";

export async function addUserConversation(
    userId: string,
    annonceId: string
): Promise<any> {
    // 🔎 Récupérer la conversation liée à l'annonce
    const { data: conversationData, error: conversationError } = await supabase
        .from("conversations")
        .select("*")
        .eq("annonce_id", annonceId)
        .single();

    if (conversationError) {
        console.error("Erreur récupération conversation :", conversationError);
        throw new Error("Conversation non trouvée");
    }

    const { data: participantData, error: participantError } = await supabase
        .from("conversation_participants")
        .insert({
            conversation_id: conversationData.id,
            user_id: userId,
        })
        .select();

    if (participantError) {
        console.error("Erreur ajout participant :", participantError);
        throw new Error(
            "Impossible d'ajouter le participant à la conversation"
        );
    }
    return participantData;
}
