import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";

type MessageContextType = {
    unreadCount: number;
    unreadConversations: Record<string, boolean>;
    refreshUnread: () => Promise<void>;
    markConversationRead: (conversationId: string) => Promise<void>;
};

const MessageContext = createContext<MessageContextType>({
    unreadCount: 0,
    unreadConversations: {},
    refreshUnread: async () => {},
    markConversationRead: async () => {},
});

export const MessageProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [unreadConversations, setUnreadConversations] = useState<
        Record<string, boolean>
    >({});

    /* -------------------------------
     1️⃣ CHARGEMENT INITIAL (BDD)
  -------------------------------- */
    const refreshUnread = async () => {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user.id;
        if (!userId) return;

        const { data, error } = await supabase
            .from("conversation_participants")
            .select(
                `
        conversation_id,
        last_read_at,
        conversations (
          messages (
            created_at
          )
        )
      `
            )
            .eq("user_id", userId)
            .order("created_at", {
                referencedTable: "conversations.messages",
                ascending: false,
            })
            .limit(1, { foreignTable: "conversations.messages" });

        if (error) {
            console.error("Erreur refresh unread:", error);
            return;
        }

        const unreadMap: Record<string, boolean> = {};

        data.forEach((cp) => {
            const lastMessage = cp.conversations?.messages?.[0];
            if (!lastMessage) return;

            const hasUnread =
                !cp.last_read_at ||
                new Date(lastMessage.created_at) > new Date(cp.last_read_at);

            if (hasUnread) {
                unreadMap[cp.conversation_id] = true;
            }
        });

        setUnreadConversations(unreadMap);
    };

    /* -------------------------------
     2️⃣ REALTIME (INSERT MESSAGE)
  -------------------------------- */
    useEffect(() => {
        refreshUnread();

        const channel = supabase
            .channel("messages-global")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                async (payload) => {
                    const message = payload.new;

                    // On marque la conversation comme non lue
                    setUnreadConversations((prev) => ({
                        ...prev,
                        [message.conversation_id]: true,
                    }));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    /* -------------------------------
     3️⃣ MARQUER COMME LU
  -------------------------------- */
    const markConversationRead = async (conversationId: string) => {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user.id;
        if (!userId) return;

        await supabase
            .from("conversation_participants")
            .update({
                last_read_at: new Date().toISOString(),
            })
            .eq("conversation_id", conversationId)
            .eq("user_id", userId);

        setUnreadConversations((prev) => {
            const copy = { ...prev };
            delete copy[conversationId];
            return copy;
        });
    };

    const unreadCount = Object.keys(unreadConversations).length;

    return (
        <MessageContext.Provider
            value={{
                unreadCount,
                unreadConversations,
                refreshUnread,
                markConversationRead,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

/* -------------------------------
   HOOK
-------------------------------- */
export const useMessageStatus = () => useContext(MessageContext);
