import { supabase } from "../../../utils/supabase";

export type ConversationPreview = {
    conversation_id: string;
    annonce_title: string | null;
    image_profile: string | null;
    firstname: string | null;
    lastname: string | null;
    last_message: string | null;
    last_message_time: string | null;
};

export async function getUserConversationsPreview(
    userId: string,
): Promise<ConversationPreview[]> {
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

    if (error) {
        console.error("Erreur chargement conversations:", error);
        throw error;
    }

    return data.map((item) => {
        const conv = item.conversations;
        const lastMessage = conv?.messages?.[0];

        return {
            conversation_id: conv?.id ?? item.conversation_id,
            annonce_title: conv?.annonces?.title ?? null,
            image_profile: conv?.annonces?.users?.image_profile ?? null,
            firstname: conv?.annonces?.users?.firstname ?? null,
            lastname: conv?.annonces?.users?.lastname ?? null,
            last_message: lastMessage?.content ?? null,
            last_message_time: lastMessage?.created_at ?? null,
            avatar_updated_at: conv?.annonces?.users?.avatar_updated_at ?? null,
            contract: conv?.annonces?.users?.contract ?? null,
            user_id: conv?.annonces?.users?.id ?? null,
        };
    });
}
