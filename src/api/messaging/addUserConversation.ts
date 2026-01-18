import { supabase } from "../../../utils/supabase";

export async function addUserConversation(
    userId: string,
    annonceId: string
): Promise<any> {
    try {
        // 🔎 Récupérer la conversation liée à l'annonce
        const { data: conversationData, error: conversationError } = await supabase
            .from("conversations")
            .select("*")
            .eq("annonce_id", annonceId)
            .single();

        if (conversationError) {
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
            throw new Error(
                "Impossible d'ajouter le participant à la conversation"
            );
        }
        return participantData;
    } catch (error) {
        if (__DEV__) console.error("addUserConversation error:", error);
        throw error;
    }
}
