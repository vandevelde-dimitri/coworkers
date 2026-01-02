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

    // ----------------------------------
    // 🔹 LOAD INITIAL UNREAD (BDD)
    // ----------------------------------
    const loadUnreadConversations = async () => {
        if (!userId) return;

        const { data, error } = await supabase.rpc("get_unread_conversations", {
            p_user_id: userId,
        });

        if (error) {
            console.error("❌ get_unread_conversations:", error);
            return;
        }

        const map: Record<string, boolean> = {};
        data?.forEach((row: any) => {
            map[row.conversation_id] = true;
        });

        setUnreadConversations(map);
    };

    // ----------------------------------
    // 🔹 REALTIME LISTENER
    // ----------------------------------
    useEffect(() => {
        if (!userId) return;

        // 🔥 1. Load unread on connect
        loadUnreadConversations();

        // 🔥 2. Realtime new messages
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

                    // ❌ ignore my own messages
                    if (msg.sender_id === userId) return;

                    // 🔴 mark conversation as unread
                    setUnreadConversations((prev) => ({
                        ...prev,
                        [msg.conversation_id]: true,
                    }));

                    // 🔄 refresh conversation previews
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

    // ----------------------------------
    // 🔹 MARK CONVERSATION AS READ
    // ----------------------------------
    const markConversationRead = async (conversationId: string) => {
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
