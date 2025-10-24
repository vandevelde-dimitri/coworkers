import { supabase } from "../../../utils/supabase";
import { Announcement } from "../../types/announcement.interface";

export default async function deleteAnnouncement(
    id: string
): Promise<Announcement | null> {
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
        throw new Error("Utilisateur non authentifié");
    }

    const { data, error } = await supabase
        .from("annonces")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error deleted announcement:", error);
        throw error;
    }
    return data;
}
