import React from "react";
import { FlatList } from "react-native";
import ConversationItem from "../../components/ConversationItem";
import SafeScreen from "../../components/SafeScreen";

export default function ConversationsListScreen({ navigation }: any) {
    // Fake data
    const conversations = [
        {
            id: "1",
            name: "Dimitri",
            lastMessage: "Ça marche parfait !",
            time: "14:22",
            unread: true,
        },
        {
            id: "2",
            name: "Sarah",
            lastMessage: "Tu pars à 5h demain ?",
            time: "12:03",
            unread: false,
        },
        {
            id: "3",
            name: "Rayan",
            lastMessage: "Ok nickel merci !",
            time: "Hier",
            unread: false,
        },
    ];

    return (
        <SafeScreen title="Messages">
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ConversationItem
                        item={item}
                        onPress={() =>
                            navigation.navigate("ChatScreen", { user: item })
                        }
                    />
                )}
            />
        </SafeScreen>
    );
}
