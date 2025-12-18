import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    message: {
        content: string;
        created_at: string;
        isMine: boolean;
    };
};

export default function MessageBubble({ message }: Props) {
    const { isMine, content, created_at } = message;

    return (
        <View style={[styles.container, isMine ? styles.right : styles.left]}>
            <View
                style={[
                    styles.bubble,
                    isMine ? styles.bubbleRight : styles.bubbleLeft,
                ]}
            >
                <Text style={styles.text}>{content}</Text>
                <Text style={styles.time}>
                    {new Date(created_at).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        paddingHorizontal: 12,
    },
    right: {
        alignItems: "flex-end",
    },
    left: {
        alignItems: "flex-start",
    },
    bubble: {
        maxWidth: "80%",
        padding: 10,
        borderRadius: 14,
    },
    bubbleRight: {
        backgroundColor: "#DCFCE7",
        borderBottomRightRadius: 4,
    },
    bubbleLeft: {
        backgroundColor: "#F3F4F6",
        borderBottomLeftRadius: 4,
    },
    text: { color: "#111827", fontSize: 15 },
    time: {
        marginTop: 4,
        fontSize: 11,
        color: "#6B7280",
        textAlign: "right",
    },
});
