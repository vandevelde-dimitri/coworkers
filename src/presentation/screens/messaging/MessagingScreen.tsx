import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { ConversationItem } from "../../components/ui/ConversationItem";
import { useMessageStatus } from "../../hooks/context/messageContext";
import { useGetConversations } from "../../hooks/queries/useGetConversation";

export default function MessagingScreen() {
    const { data: conversation, isLoading } = useGetConversations();
    const { unreadConversations } = useMessageStatus();
    const router = useRouter();

    return (
        <ScreenWrapper title="Conversation" showBackButton={false}>
            <FlatList
                data={conversation}
                renderItem={({ item }) => (
                    <ConversationItem
                        item={item}
                        unread={!!unreadConversations[item.id]}
                        onPress={() =>
                            router.push({
                                pathname: "/(tabs)/messaging/[id]",
                                params: { id: item.id },
                            })
                        }
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 20,
    },
});
