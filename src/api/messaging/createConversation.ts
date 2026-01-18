import { supabase } from "../../../utils/supabase";

export async function createConversation(
    announcementId: string,
): Promise<string> {
    try {
        const { data, error } = await supabase
            .from("conversations")
            .upsert({ annonce_id: announcementId })
            .select("id")
            .single();

        if (error) {
            throw new Error("Failed to create or retrieve conversation");
        }

        return data.id;
    } catch (error) {
        if (__DEV__) console.error("createConversation error:", error);
        throw error;
    }
}
