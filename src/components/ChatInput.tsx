import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function ChatInput({ onSend }: any) {
    const [text, setText] = useState("");

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                borderTopWidth: 1,
                borderTopColor: "#e5e7eb",
                backgroundColor: "#ffffff",
            }}
        >
            <TextInput
                style={{
                    flex: 1,
                    backgroundColor: "#f9fafb",
                    borderRadius: 24,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                }}
                placeholder="Écrire un message…"
                value={text}
                onChangeText={setText}
                multiline
            />
            <TouchableOpacity
                style={{
                    marginLeft: 8,
                    backgroundColor: "#2563eb",
                    padding: 12,
                    borderRadius: 24,
                }}
                onPress={() => {
                    if (!text.trim()) return;
                    onSend(text.trim());
                    setText("");
                }}
            >
                <Ionicons name="send" size={22} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: "white",
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "flex-end",
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: "#F3F4F6",
        borderRadius: 10,
        fontSize: 15,
        maxHeight: 120,
    },
    sendBtn: {
        backgroundColor: "#3B82F6",
        marginLeft: 10,
        padding: 12,
        borderRadius: 10,
    },
});
