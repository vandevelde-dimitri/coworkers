import { supabase } from "../../../utils/supabase";

export type Message = {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
};

export async function getConversationMessages(conversationId: string) {
    try {
        const { data, error } = await supabase
            .from("messages")
            .select(
                `
          id,
          sender_id,
          content,
          created_at
        `,
            )
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        if (error) {
            throw error;
        }

        return data as Message[];
    } catch (error) {
        if (__DEV__) console.error("getConversationMessages error:", error);
        throw error;
    }
}
