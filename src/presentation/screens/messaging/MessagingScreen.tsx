import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { ConversationItem } from "../../components/ui/ConversationItem";

export default function MessagingScreen() {
    const router = useRouter();
    const DUMMY_DATA = [
        {
            id: "1",
            name: "Jean-Michel",
            lastMessage: "Salut, ça va ?",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            unread: 2,
        },
        {
            id: "2",
            name: "Sophie",
            lastMessage: "On se voit demain ?",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            unread: 0,
        },
        {
            id: "3",
            name: "Alex",
            lastMessage: "J'ai une question sur l'annonce.",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            unread: 1,
        },
    ];

    return (
        <ScreenWrapper title="Messages" showBackButton={false}>
            <FlatList
                data={DUMMY_DATA}
                renderItem={({ item }) => (
                    <ConversationItem
                        item={item}
                        unread={!!unreadConversations[item.conversation_id]}
                        onPress={() => console.log("toto")}
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
