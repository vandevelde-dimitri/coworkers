import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";
import { FlatList } from "react-native";
import ConversationItem from "../../components/ConversationItem";
import ScreenWrapper from "../../components/ui/CustomHeader";
import EmptyState from "../../components/ui/EmptyComponent";
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
                contentContainerStyle={{
                    paddingBottom: 32,
                    flexGrow: 1,
                    justifyContent:
                        conversations.length === 0 ? "center" : "flex-start",
                }}
                ListEmptyComponent={
                    <EmptyState
                        title="Aucune conversation"
                        description="Vous ne faites partie d’aucune conversation pour le moment. Vous pouvez en démarrer une en postulant à une annonce."
                        actionLabel="Explorer les annonces"
                        onAction={() =>
                            (navigation as any).navigate("HomeStack", {
                                screen: "HomeScreen",
                            })
                        }
                    />
                }
                showsVerticalScrollIndicator={false}
            />
        </ScreenWrapper>
    );
}
