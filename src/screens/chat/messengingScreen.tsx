import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { supabase } from "../../../utils/supabase";
import ChatInput from "../../components/ChatInput";
import MessageBubble from "../../components/MessageBubble";
import SafeScreen from "../../components/SafeScreen";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { useAuth } from "../../contexts/authContext";
import { useMessageStatus } from "../../contexts/messageContext";

const PAGE_SIZE = 50;

export default function ChatScreen({ route }: any) {
    const { conversationId, title } = route.params;
    const { session } = useAuth();
    const { markConversationRead } = useMessageStatus();
    const flatListRef = useRef<FlatList>(null);

    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const transformMessages = (data: any[]) =>
        data.map((m) => ({
            id: m.id,
            content: m.content,
            created_at: m.created_at,
            isMine: m.sender_id === session?.user.id,
            avatar: m.users?.image_profile ?? null,
            update_avatar: m.users?.avatar_updated_at ?? null,
            contract: m.users?.contract,
            user_id: m.users?.id,
        }));

    // ---------------------------
    // Charger messages avec pagination
    // ---------------------------
    const loadMessages = useCallback(
        async (pageNumber = 0) => {
            if (!conversationId || !hasMore) return;

            try {
                const from = pageNumber * PAGE_SIZE;
                const to = from + PAGE_SIZE - 1;

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
                            image_profile, 
                            avatar_updated_at,
                            contract
                        )
                    `,
                    )
                    .eq("conversation_id", conversationId)
                    .order("created_at", { ascending: true })
                    .range(from, to);

                if (error) throw error;

                if (data) {
                    // prepend pour les anciens messages
                    setMessages((prev) => [
                        ...transformMessages(data),
                        ...prev,
                    ]);
                    if (data.length < PAGE_SIZE) setHasMore(false);
                }

                // Marquer conversation lue
                markConversationRead(conversationId);
            } catch (err) {
                console.error("Erreur chargement messages:", err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [conversationId, hasMore, session?.user.id],
    );

    // ---------------------------
    // Chargement initial des messages
    // ---------------------------
    useEffect(() => {
        if (conversationId) {
            loadMessages(0);
        }
    }, [conversationId]);

    // ---------------------------
    // Realtime: ajout direct au state
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
                (payload: any) => {
                    const newMessage = transformMessages([payload.new])[0];
                    setMessages((prev) => [...prev, newMessage]);
                    markConversationRead(conversationId); // nouveau message lu
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, session?.user.id]);

    // ---------------------------
    // Envoi message
    // ---------------------------
    const onSend = async (text: string) => {
        if (!text.trim()) return;

        try {
            const { error } = await supabase.from("messages").insert({
                conversation_id: conversationId,
                sender_id: session?.user.id,
                content: text,
            });
            if (error) throw error;
        } catch (err) {
            console.error("Erreur envoi message:", err);
        }
    };

    // ---------------------------
    // Pagination scroll top
    // ---------------------------
    const onLoadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            loadMessages(nextPage);
        }
    };

    // ---------------------------
    // Loader pour pagination
    // ---------------------------
    const ListHeaderComponent = () =>
        loadingMore ? (
            <View style={{ padding: 10 }}>
                <ActivityIndicator size="small" />
            </View>
        ) : null;

    if (loading) {
        return (
            <SafeScreen backBtn title={title ?? "Conversation"}>
                <Text>Chargement…</Text>
            </SafeScreen>
        );
    }

    return (
        <ScreenWrapper title={title} back>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MessageBubble message={item} />}
                showsVerticalScrollIndicator={false}
                inverted // dernier message en bas
                onEndReached={onLoadMore} // scroll vers le haut pour charger anciens
                onEndReachedThreshold={0.1}
                ListHeaderComponent={ListHeaderComponent}
            />

            <ChatInput onSend={onSend} />
        </ScreenWrapper>
    );
}
