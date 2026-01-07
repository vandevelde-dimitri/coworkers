import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Text } from "react-native";
import { supabase } from "../../../utils/supabase";
import ChatInput from "../../components/ChatInput";
import MessageBubble from "../../components/MessageBubble";
import SafeScreen from "../../components/SafeScreen";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { useAuth } from "../../contexts/authContext";
import { useMessageStatus } from "../../contexts/messageContext";

export default function ChatScreen({ route }: any) {
    const { conversationId, title } = route.params;
    const { session } = useAuth();
    const { markConversationRead } = useMessageStatus();

    const flatListRef = useRef<FlatList>(null);

    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ---------------------------
    // Charger les messages
    // ---------------------------
    const loadMessages = useCallback(async () => {
        if (!conversationId) return;

        const { data, error } = await supabase
            .from("messages")
            .select(
                `
        id,
        sender_id,
        content,
        created_at,
        users (
          id,
          image_profile
        )
      `
            )
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error(error);
            return;
        }

        if (data) {
            setMessages(
                data.map((m) => ({
                    id: m.id,
                    content: m.content,
                    created_at: m.created_at,
                    isMine: m.sender_id === session?.user.id,
                    avatar: m.users?.image_profile ?? null,
                }))
            );
        }

        setLoading(false);
    }, [conversationId, session?.user.id]);

    // ---------------------------
    // Init
    // ---------------------------
    useEffect(() => {
        loadMessages();
        markConversationRead(conversationId);
    }, [conversationId]);

    // ---------------------------
    // Realtime
    // ---------------------------
    useEffect(() => {
        if (!conversationId) return;

        const channel = supabase
            .channel(`chat-${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                () => {
                    // Recharger pour récupérer avatar + données complètes
                    loadMessages();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, loadMessages]);

    // ---------------------------
    // Envoyer message
    // ---------------------------
    const onSend = async (text: string) => {
        if (!text.trim()) return;

        await supabase.from("messages").insert({
            conversation_id: conversationId,
            sender_id: session?.user.id,
            content: text,
        });
    };

    // ---------------------------
    // Scroll auto
    // ---------------------------
    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    if (loading) {
        return (
            <SafeScreen backBtn title={title ?? "Conversation"}>
                <Text>Chargement…</Text>
            </SafeScreen>
        );
    }
    console.log("RAW DATA", messages);

    return (
        <ScreenWrapper title={title} back>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MessageBubble message={item} />}
                showsVerticalScrollIndicator={false}
            />

            <ChatInput onSend={onSend} />
        </ScreenWrapper>
    );
}
