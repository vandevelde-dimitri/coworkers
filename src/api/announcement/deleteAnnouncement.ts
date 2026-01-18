import { supabase } from "../../../utils/supabase";

export default async function deleteAnnouncement(id: string): Promise<void> {
    const { error } = await supabase.rpc("delete_announcement", {
        p_annonce_id: id,
    });

    if (error) {
        console.error("RPC delete_announcement error:", error);
        throw error;
    }
}
