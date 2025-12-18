import { supabase } from "../../../utils/supabase";
import { Conversation } from "../../types/conversation.interface";

export async function createConversation(
    announcementId: string
): Promise<Conversation> {
    const { data, error } = await supabase
        .from("conversations")
        .upsert({ annonce_id: announcementId })
        .select("id")
        .single();

    if (error) {
        console.error("Error creating conversation:", error);
        throw new Error("Failed to create or retrieve conversation");
    }

    return data.id;
}
