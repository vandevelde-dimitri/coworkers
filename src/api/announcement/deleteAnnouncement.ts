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

    const { error } = await supabase
        .from("participant_requests")
        .update({ status: "announce_deleted" })
        .eq("annonce_id", id);

    if (error) throw error;

    const { data, error: error_annonce } = await supabase
        .from("annonces")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error_annonce) {
        console.error("Error deleted announcement:", error_annonce);
        throw error_annonce;
    }

    return data;
}
