import { Conversation } from "@/src/domain/entities/chat/Conversation";
import { MessageInterface } from "@/src/domain/entities/chat/Message";
import { UnauthorizedError } from "@/src/domain/errors/AppError";
import { ChatRepository } from "@/src/domain/repositories/ChatRepository";
import { ChatMapper } from "../mappers/ChatMapper";
import { MessageMapper } from "../mappers/MessageMapper";
import { supabase } from "../supabase";

export class SupabaseChatRepository implements ChatRepository {
    async getMessages(
        conversationId: string,
        page: number,
        pageSize: number,
        userId: string,
    ): Promise<MessageInterface[]> {
        const from = page * pageSize;
        const to = from + pageSize - 1;

        const { data, error } = await supabase
            .from("messages")
            .select(
                `
            id,
            conversation_id,
            sender_id,
            content,
            created_at,
            users (id, firstname, lastname, image_profile, avatar_updated_at, contract)
        `,
            )
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) throw error;
        return MessageMapper.toDomainList(data || [], userId);
    }

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

        if (error) throw error;

        return ChatMapper.toDomainList(data || [], userId);
    }

    async sendMessage(conversationId: string, content: string): Promise<void> {
        const {
            data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) throw new UnauthorizedError();

        const { error } = await supabase.from("messages").insert({
            conversation_id: conversationId,
            sender_id: authUser.id,
            content: content,
        });
        if (error) throw error;
    }
}
