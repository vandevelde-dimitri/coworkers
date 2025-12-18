import { supabase } from "./supabase";

export async function onApply(annonceId: string) {
    // 1️⃣ Session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user.id;

    if (!userId) {
        throw new Error("Utilisateur non connecté");
    }

    // 2️⃣ Récupérer la conversation liée à l’annonce
    const { data: annonce, error: annonceError } = await supabase
        .from("annonces")
        .select("conversation_id, number_of_places")
        .eq("id", annonceId)
        .single();

    if (annonceError || !annonce?.conversation_id) {
        throw new Error("Conversation introuvable pour cette annonce");
    }

    const conversationId = annonce.conversation_id;

    if (annonce.number_of_places <= 0) {
        throw new Error("Plus de place disponible");
    }

    // 3️⃣ Ajouter l'utilisateur à la conversation
    const { error: participantError } = await supabase
        .from("conversation_participants")
        .insert({
            conversation_id: conversationId,
            user_id: userId,
        });

    if (participantError) {
        throw participantError;
    }

    // 4️⃣ Décrémenter les places
    const { error: updateError } = await supabase
        .from("annonces")
        .update({
            number_of_places: annonce.number_of_places - 1,
        })
        .eq("id", annonceId);

    if (updateError) {
        throw updateError;
    }

    return true;
}
