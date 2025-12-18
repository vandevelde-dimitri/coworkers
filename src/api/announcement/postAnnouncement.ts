import { supabase } from "../../../utils/supabase";
import {
    Announcement,
    AnnouncementFormValues,
} from "../../types/announcement.interface";

export default async function addAnnouncement(
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
        .insert([{ ...body, user_id: userId }])
        .select()
        .single();

    if (error) {
        console.error("Error adding announcement:", error);
        throw error;
    }
    // console.log("Announcement added:", data);
    return data;
}
