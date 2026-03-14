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
  connectionStatus: "SUBSCRIBED" | "CHANNEL_ERROR" | "LOADING";
};

const MessageContext = createContext<MessageContextType>({
  unreadCount: 0,
  unreadConversations: {},
  markConversationRead: async () => {},
  setActiveConversation: () => {},
  connectionStatus: "LOADING",
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
  const [connectionStatus, setConnectionStatus] = useState<
    "SUBSCRIBED" | "CHANNEL_ERROR" | "LOADING"
  >("LOADING");

  const activeConversationRef = useRef<string | null>(null);
  const retryCount = useRef(0);

  const setActiveConversation = useCallback((conversationId: string | null) => {
    activeConversationRef.current = conversationId;
  }, []);

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
    data?.forEach((row: { conversation_id: string }) => {
      map[row.conversation_id] = true;
    });
    setUnreadConversations(map);
  };

  useEffect(() => {
    if (!userId) return;
    loadUnreadConversations();

    let channel = supabase.channel("messages-global");

    const subscribe = () => {
      channel = supabase
        .channel("messages-global")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const msg = payload.new as {
              sender_id: string;
              conversation_id: string;
            };
            if (
              msg.sender_id === userId ||
              msg.conversation_id === activeConversationRef.current
            )
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
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            setConnectionStatus("SUBSCRIBED");
            retryCount.current = 0;
          } else {
            setConnectionStatus("CHANNEL_ERROR");
            const delay = Math.min(
              1000 * Math.pow(2, retryCount.current),
              30000,
            );
            setTimeout(() => {
              retryCount.current++;
              supabase.removeChannel(channel);
              subscribe();
            }, delay);
          }
        });
    };

    subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const markConversationRead = async (conversationId: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", userId);

    if (!error) {
      setUnreadConversations((prev) => {
        const copy = { ...prev };
        delete copy[conversationId];
        return copy;
      });
    }
  };

  return (
    <MessageContext.Provider
      value={{
        unreadCount: Object.keys(unreadConversations).length,
        unreadConversations,
        markConversationRead,
        setActiveConversation,
        connectionStatus,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageStatus = () => useContext(MessageContext);
