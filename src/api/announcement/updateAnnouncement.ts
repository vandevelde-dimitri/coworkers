import { supabase } from "../../../utils/supabase";
import {
    Announcement,
    AnnouncementFormValues,
} from "../../types/announcement.interface";

export default async function updateAnnouncement(
    id: string,
    body: AnnouncementFormValues
): Promise<Announcement | null> {
    try {
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
            .update({ ...body, user_id: userId })
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        if (__DEV__) console.error("updateAnnouncement error:", error);
        throw error;
    }
}
