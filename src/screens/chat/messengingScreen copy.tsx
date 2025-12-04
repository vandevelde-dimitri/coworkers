import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ChatScreen() {
    const [messages, setMessages] = useState([
        { id: "1", text: "Salut 👋", sender: "other" },
        { id: "2", text: "Hey, ça va ?", sender: "me" },
        { id: "3", text: "Oui nickel, et toi ?", sender: "other" },
    ]);
    const [input, setInput] = useState("");

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.back}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Image
                    source={{ uri: "https://i.pravatar.cc/150?img=5" }}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.name}>Jean Dupont</Text>
                    <Text style={styles.status}>En ligne</Text>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.message,
                            item.sender === "me"
                                ? styles.myMessage
                                : styles.otherMessage,
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageText,
                                item.sender === "me" && { color: "#fff" },
                            ]}
                        >
                            {item.text}
                        </Text>
                    </View>
                )}
                contentContainerStyle={{ padding: 16 }}
            />

            {/* Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Écrire un message..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#f3f4f6",
    },
    back: { marginRight: 12 },
    avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
    name: { fontSize: 16, fontWeight: "600", color: "#111827" },
    status: { fontSize: 12, color: "#6b7280" },

    // Messages
    message: {
        maxWidth: "75%",
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
    },
    myMessage: {
        backgroundColor: "#10B981",
        alignSelf: "flex-end",
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        backgroundColor: "#f3f4f6",
        alignSelf: "flex-start",
        borderBottomLeftRadius: 4,
    },
    messageText: { fontSize: 15, color: "#111827" },

    // Input
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderTopWidth: 1,
        borderColor: "#f3f4f6",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginRight: 8,
        fontSize: 15,
    },
    sendButton: {
        backgroundColor: "#10B981",
        padding: 10,
        borderRadius: 20,
    },
});
