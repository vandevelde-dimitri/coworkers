import { supabase } from "../../../utils/supabase";

export default async function deleteAnnouncement(id: string): Promise<void> {
    try {
        const { error } = await supabase.rpc("delete_announcement", {
            p_annonce_id: id,
        });

        if (error) throw error;
    } catch (error) {
        if (__DEV__) console.error("deleteAnnouncement error:", error);
        throw error;
    }
}
