import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { FlatList } from "react-native";
import ConversationItem from "../../components/ConversationItem";
import ScreenWrapper from "../../components/ui/CustomHeader";
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
        <ScreenWrapper title="Mes conversations">
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.conversation_id}
                renderItem={({ item }) => (
                    <ConversationItem
                        item={item}
                        unread={!!unreadConversations[item.conversation_id]}
                        onPress={() =>
                            navigation.navigate("ChatScreen", {
                                conversationId: item.conversation_id,
                                title: item.annonce_title,
                            })
                        }
                    />
                )}
                showsVerticalScrollIndicator={false}
            />
        </ScreenWrapper>
    );
}
