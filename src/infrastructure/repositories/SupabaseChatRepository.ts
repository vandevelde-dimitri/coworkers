import { Conversation } from "@/src/domain/entities/chat/Conversation";
import { ChatRepository } from "@/src/domain/repositories/ChatRepository";
import { ChatMapper } from "../mappers/ChatMapper";
import { supabase } from "../supabase";

export class SupabaseChatRepository implements ChatRepository {
    async getUserConversations(userId: string): Promise<Conversation[]> {
        const { data, error } = await supabase
            .from("conversation_participants")
            .select(
                `
    conversation_id,
    conversations (
      id,
      annonces!fk_conversation_annonce (
        title,
        users:user_id (
        id,
          image_profile,
          firstname,
          lastname,
          contract,
            avatar_updated_at
        )
      ),
      messages (
        content,
        created_at
      )
    )
    `,
            )
            .eq("user_id", userId)
            .order("created_at", {
                referencedTable: "conversations.messages",
                ascending: false,
            })
            .limit(1, { foreignTable: "conversations.messages" });

        console.log("Data brute reçue:", JSON.stringify(data, null, 2));

        if (error) throw error;

        return ChatMapper.toDomainList(data || [], userId);
    }
}
