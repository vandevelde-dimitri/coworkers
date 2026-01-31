import { supabase } from "../../../utils/supabase";
import {
    Announcement,
    AnnouncementFormValues,
} from "../../types/announcement.interface";
import { createConversation } from "../messaging/createConversation";

export default async function addAnnouncement(
    body: AnnouncementFormValues,
): Promise<Announcement | null> {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            throw new Error("Utilisateur non authentifié");
        }

        const userId = session.user.id;

        const { data: annonce, error: annonceError } = await supabase
            .from("annonces")
            .insert([{ ...body, user_id: userId }])
            .select()
            .single();

        if (annonceError || !annonce) throw annonceError;

        const conversationId = await createConversation(annonce.id);
        if (!conversationId) throw new Error("Conversation non créée");

        await supabase
            .from("annonces")
            .update({ conversation_id: conversationId })
            .eq("id", annonce.id);

        await supabase.from("conversation_participants").insert({
            conversation_id: conversationId,
            user_id: userId,
        });

        return annonce;
    } catch (error) {
        if (__DEV__) console.error("addAnnouncement error:", error);
        throw error;
    }
}
