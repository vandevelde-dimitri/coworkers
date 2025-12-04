import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import ChatInput from "../../components/ChatInput";
import MessageBubble from "../../components/MessageBubble";
import SafeScreen from "../../components/SafeScreen";

export default function ChatScreen({ route }: any) {
    const [messages, setMessages] = useState([
        {
            id: "1",
            text: "Salut, tu pars quand demain ?",
            time: "14:22",
            isMine: false,
        },
        {
            id: "2",
            text: "Salut ! Vers 5h du matin.",
            time: "14:25",
            isMine: true,
        },
    ]);

    const onSend = (text: string) => {
        const newMsg = {
            id: Math.random().toString(),
            text,
            time: "Maintenant",
            isMine: true,
        };
        setMessages((prev: any) => [...prev, newMsg]);
    };

    return (
        <SafeScreen backBtn title="toto">
            <FlatList
                data={messages}
                renderItem={({ item }) => <MessageBubble message={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />

            <ChatInput onSend={onSend} />
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingVertical: 10,
    },
});
