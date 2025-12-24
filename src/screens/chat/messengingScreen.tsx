import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { supabase } from "../../../utils/supabase";
import ChatInput from "../../components/ChatInput";
import MessageBubble from "../../components/MessageBubble";
import SafeScreen from "../../components/SafeScreen";
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
    // Charger messages initiaux
    // ---------------------------
    const loadMessages = async () => {
        if (!conversationId) return;

        const { data } = await supabase
            .from("messages")
            .select("id, sender_id, content, created_at")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

        if (data) {
            setMessages(
                data.map((m) => ({
                    ...m,
                    isMine: m.sender_id === session?.user.id,
                }))
            );
        }
        setLoading(false);
    };

    // ---------------------------
    // Load + mark read au montage
    // ---------------------------
    useEffect(() => {
        loadMessages();
        markConversationRead(conversationId);
    }, [conversationId]);

    // ---------------------------
    // Realtime pour nouveaux messages
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
                (payload) => {
                    const msg = payload.new;
                    setMessages((prev) => [
                        ...prev,
                        {
                            ...msg,
                            isMine: msg.sender_id === session?.user.id,
                        },
                    ]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);

    // ---------------------------
    // Envoyer un message
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
    // Scroll auto à la fin
    // ---------------------------
    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    if (loading)
        return (
            <SafeScreen backBtn title={title ?? "Conversation"}>
                {/* Ici tu peux mettre un loader si tu veux */}
                <Text>Loading messages...</Text>
            </SafeScreen>
        );

    return (
        <SafeScreen backBtn title={title ?? "Conversation"}>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MessageBubble message={item} />}
                contentContainerStyle={styles.list}
            />

            <ChatInput onSend={onSend} />
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    list: { paddingVertical: 10 },
});
