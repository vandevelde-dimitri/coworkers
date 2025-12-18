import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
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
    const queryClient = useQueryClient();

    const flatListRef = useRef<FlatList>(null);
    const [messages, setMessages] = useState<any[]>([]);

    const loadMessages = async () => {
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
    };

    useEffect(() => {
        loadMessages();
        markConversationRead(conversationId);
    }, [conversationId]);

    useEffect(() => {
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

    const onSend = async (text: string) => {
        if (!text.trim()) return;

        await supabase.from("messages").insert({
            conversation_id: conversationId,
            sender_id: session?.user.id,
            content: text,
        });

        // 🔥 refresh preview
        queryClient.invalidateQueries({
            queryKey: ["user-conversations", session?.user.id],
        });
    };

    return (
        <SafeScreen backBtn title={title ?? "Conversation"}>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MessageBubble message={item} />}
                contentContainerStyle={styles.list}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
            />
            <ChatInput onSend={onSend} />
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    list: { paddingVertical: 10 },
});
