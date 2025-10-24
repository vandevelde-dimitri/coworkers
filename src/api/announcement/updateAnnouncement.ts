import { supabase } from "../../../utils/supabase";
import {
    Announcement,
    AnnouncementFormValues,
} from "../../types/announcement.interface";

export default async function updateAnnouncement(
    id: string,
    body: AnnouncementFormValues
): Promise<Announcement | null> {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
        throw new Error("Utilisateur non authentifié");
    }

    const userId = session.user.id;

    const { data, error } = await supabase
        .from("annonces")
        .update({ ...body, user_id: userId }) // Objet au lieu de tableau
        .eq("id", id) // WHERE clause pour spécifier quelle annonce
        .eq("user_id", userId) // Sécurité : seul le propriétaire peut modifier
        .select()
        .single();

    if (error) {
        console.error("Error updated announcement:", error);
        throw error;
    }
    return data;
}
