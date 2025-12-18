import React from "react";
import { FlatList } from "react-native";
import ConversationItem from "../../components/ConversationItem";
import SafeScreen from "../../components/SafeScreen";
import { useUserConversations } from "../../hooks/conversation/useConversationUser";

export default function ConversationsListScreen({ navigation }: any) {
    // Fake data

    const { data: conversations } = useUserConversations();

    return (
        <SafeScreen title="Messages">
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.conversation_id}
                renderItem={({ item }) => (
                    <ConversationItem
                        item={item}
                        onPress={() =>
                            navigation.navigate("ChatScreen", {
                                conversationId: item.conversation_id,
                            })
                        }
                    />
                )}
            />
        </SafeScreen>
    );
}
