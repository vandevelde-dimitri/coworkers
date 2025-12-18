import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuth } from "./authContext";

type MessageContextType = {
    unreadCount: number;
    unreadConversations: Record<string, boolean>;
    markConversationRead: (conversationId: string) => Promise<void>;
};

const MessageContext = createContext<MessageContextType>({
    unreadCount: 0,
    unreadConversations: {},
    markConversationRead: async () => {},
});

export const MessageProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { session } = useAuth();
    const userId = session?.user.id;
    const queryClient = useQueryClient();

    const [unreadConversations, setUnreadConversations] = useState<
        Record<string, boolean>
    >({});

    // ---------------------------
    // Chargement initial (BDD)
    // ---------------------------
    const loadUnreadConversations = async () => {
        if (!userId) return;

        const { data } = await supabase.rpc("get_unread_conversations", {
            p_user_id: userId,
        });

        if (data) {
            const map: Record<string, boolean> = {};
            data.forEach((row: any) => {
                map[row.conversation_id] = true;
            });
            setUnreadConversations(map);
        }
    };

    // ---------------------------
    // Realtime messages
    // ---------------------------
    useEffect(() => {
        if (!userId) return;

        loadUnreadConversations();

        const channel = supabase
            .channel("messages-global")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                (payload) => {
                    const msg = payload.new;

                    // ignorer mes propres messages
                    if (msg.sender_id === userId) return;

                    // badge non-lu
                    setUnreadConversations((prev) => ({
                        ...prev,
                        [msg.conversation_id]: true,
                    }));

                    // 🔥 refresh preview conversations
                    queryClient.invalidateQueries({
                        queryKey: ["user-conversations", userId],
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // ---------------------------
    // Marquer une conversation comme lue
    // ---------------------------
    const markConversationRead = async (conversationId: string) => {
        if (!userId) return;

        await supabase.from("conversation_reads").upsert({
            conversation_id: conversationId,
            user_id: userId,
            last_read_at: new Date().toISOString(),
        });

        setUnreadConversations((prev) => {
            const copy = { ...prev };
            delete copy[conversationId];
            return copy;
        });
    };

    return (
        <MessageContext.Provider
            value={{
                unreadCount: Object.keys(unreadConversations).length,
                unreadConversations,
                markConversationRead,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export const useMessageStatus = () => useContext(MessageContext);
