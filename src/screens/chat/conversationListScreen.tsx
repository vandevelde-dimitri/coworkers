import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { ScrollView, Text } from "react-native";
import ConversationItem from "../../components/ConversationItem";
import { useMessageStatus } from "../../contexts/messageContext";
import { useUserConversations } from "../../hooks/conversation/useConversationUser";

export default function ConversationsListScreen({ navigation }: any) {
    const { data: conversations, isLoading, refetch } = useUserConversations();
    const { unreadConversations } = useMessageStatus();

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );
    if (!conversations) return null;
    if (isLoading) return null;

    return (
        <ScrollView style={{ padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>
                Messages
            </Text>
            {conversations.map((c) => (
                <ConversationItem
                    item={c}
                    unread={!!unreadConversations[c.conversation_id]}
                    onPress={() =>
                        navigation.navigate("ChatScreen", {
                            conversationId: c.conversation_id,
                            title: c.annonce_title,
                        })
                    }
                />
            ))}
        </ScrollView>
    );
}
