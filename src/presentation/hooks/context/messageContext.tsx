import { supabase } from "@/src/infrastructure/supabase";
import { logger } from "@/utils/logger";
import { useQueryClient } from "@tanstack/react-query";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useAuth } from "../authContext";

type MessageContextType = {
    unreadCount: number;
    unreadConversations: Record<string, boolean>;
    markConversationRead: (conversationId: string) => Promise<void>;
    setActiveConversation: (conversationId: string | null) => void;
};

const MessageContext = createContext<MessageContextType>({
    unreadCount: 0,
    unreadConversations: {},
    markConversationRead: async () => {},
    setActiveConversation: () => {},
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

    const activeConversationRef = useRef<string | null>(null);

    const setActiveConversation = useCallback(
        (conversationId: string | null) => {
            activeConversationRef.current = conversationId;
        },
        [],
    );

    const loadUnreadConversations = async () => {
        if (!userId) return;

        const { data, error } = await supabase.rpc("get_unread_conversations", {
            p_user_id: userId,
        });

        if (error) {
            await logger.critical(
                "ERR_CTX_MESS",
                "get_unread_conversations",
                error,
                userId,
            );
            return;
        }

        const map: Record<string, boolean> = {};
        data?.forEach((row: any) => {
            map[row.conversation_id] = true;
        });

        setUnreadConversations(map);
    };

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
                    const msg = payload.new as {
                        sender_id: string;
                        conversation_id: string;
                    };

                    if (msg.sender_id === userId) return;

                    if (msg.conversation_id === activeConversationRef.current)
                        return;

                    setUnreadConversations((prev) => ({
                        ...prev,
                        [msg.conversation_id]: true,
                    }));

                    queryClient.invalidateQueries({
                        queryKey: ["user-conversations", userId],
                    });
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const markConversationRead = async (conversationId: string) => {
        if (!userId) return;

        if (__DEV__) {
            console.log(
                `🔴 markConversationRead appelé pour: ${conversationId} par user: ${userId.slice(0, 8)}`,
            );
        }

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
                setActiveConversation,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export const useMessageStatus = () => useContext(MessageContext);
