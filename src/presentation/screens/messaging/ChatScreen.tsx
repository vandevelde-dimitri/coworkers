import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";

// --- Imports Architecture & Hooks ---
import { useAuth } from "@/src/presentation/context/authContext";
import { useChatMessages } from "@/src/presentation/hooks/useChatMessages";
import { useSendMessage } from "@/src/presentation/hooks/useSendMessage";
import { Message } from "@/src/domain/entities/chat/Message";

interface ChatScreenProps {
    conversationId: string;
    interlocutorName?: string;
}

export default function ChatScreen({
    conversationId,
    interlocutorName,
}: ChatScreenProps) {
    const { session } = useAuth();
    const userId = session?.user.id ?? "";
    const [messageText, setMessageText] = useState("");

    // 1. Récupération des messages avec pagination infinie et Realtime
    const { 
        data, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isLoading 
    } = useChatMessages(conversationId, userId);

    // 2. Hook pour l'envoi de messages
    const { mutate: sendMessage, isPending: isSending } = useSendMessage(conversationId);

    // Transformation des pages TanStack Query en une liste plate de messages
    const messages = data?.pages.flat() ?? [];

    const handleSend = () => {
        if (!messageText.trim() || isSending) return;
        
        sendMessage(
            { userId, content: messageText },
            {
                onSuccess: () => setMessageText(""), // Vide l'input après succès
            }
        );
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMine = item.isMine;
        
        // Formatage simple de l'heure
        const time = item.createdAt 
            ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : "";

        return (
            <View
                style={[
                    styles.messageRow,
                    isMine ? styles.myRow : styles.theirRow,
                ]}
            >
                <LinearGradient
                    colors={
                        isMine
                            ? ["#1E3A8A", "#3B82F6"]
                            : [
                                  "rgba(255, 255, 255, 0.1)",
                                  "rgba(255, 255, 255, 0.05)",
                              ]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.bubble,
                        isMine ? styles.myBubble : styles.theirBubble,
                    ]}
                >
                    <Text style={styles.messageText}>{item.content}</Text>
                    <Text style={styles.messageTime}>{time}</Text>
                </LinearGradient>
            </View>
        );
    };

    return (
        <ScreenWrapper title={interlocutorName ?? "Messages"} showBackButton={true}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                {isLoading ? (
                    <View style={styles.center}>
                        <ActivityIndicator color="#3B82F6" />
                    </View>
                ) : (
                    <FlatList
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.chatList}
                        inverted // Affiche les messages du bas vers le haut
                        onEndReached={() => {
                            if (hasNextPage) fetchNextPage();
                        }}
                        onEndReachedThreshold={0.3}
                        ListFooterComponent={
                            isFetchingNextPage ? (
                                <ActivityIndicator size="small" style={{ marginVertical: 10 }} color="#3B82F6" />
                            ) : null
                        }
                    />
                )}

                <View style={styles.inputWrapper}>
                    <LinearGradient
                        colors={[
                            "rgba(255, 255, 255, 0.08)",
                            "rgba(255, 255, 255, 0.03)",
                        ]}
                        style={styles.inputGradient}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="Votre message..."
                            placeholderTextColor="rgba(255, 255, 255, 0.4)"
                            value={messageText}
                            onChangeText={setMessageText}
                            multiline
                        />
                        <TouchableOpacity 
                            style={styles.sendButton} 
                            onPress={handleSend}
                            disabled={!messageText.trim() || isSending}
                        >
                            <LinearGradient
                                colors={["#1E3A8A", "#3B82F6"]}
                                style={[
                                    styles.sendGradient,
                                    (!messageText.trim() || isSending) && { opacity: 0.5 }
                                ]}
                            >
                                {isSending ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <SymbolView
                                        name="paperplane.fill"
                                        size={16}
                                        tintColor="#fff"
                                    />
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    chatList: { padding: 20, gap: 12 },

    messageRow: { flexDirection: "row", marginBottom: 4 },
    myRow: { justifyContent: "flex-end" },
    theirRow: { justifyContent: "flex-start" },

    bubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 22,
        maxWidth: "80%",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    myBubble: { borderBottomRightRadius: 4 },
    theirBubble: { borderBottomLeftRadius: 4 },

    messageText: { color: "#fff", fontSize: 15, lineHeight: 20 },
    messageTime: {
        fontSize: 10,
        color: "rgba(255, 255, 255, 0.4)",
        alignSelf: "flex-end",
        marginTop: 4,
    },

    inputWrapper: {
        padding: 15,
        paddingBottom: Platform.OS === "ios" ? 30 : 20,
    },
    inputGradient: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 25,
        padding: 6,
        paddingLeft: 15,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 15,
        maxHeight: 100,
        paddingVertical: 8,
    },
    sendButton: { marginLeft: 10 },
    sendGradient: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});
