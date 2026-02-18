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
} from "react-native";

export default function ChatScreen() {
    const [message, setMessage] = useState("");
    const MESSAGES_DATA = [
        { id: "1", text: "Salut, ça va ?", isMine: false },
        { id: "2", text: "Oui, et toi ?", isMine: true },
        { id: "3", text: "Ça roule ! Tu pars d'où demain ?", isMine: false },
        { id: "4", text: "Je pars de la gare à 8h30.", isMine: true },
        { id: "5", text: "Parfait, à demain alors !", isMine: false },
        {
            id: "6",
            text: "N'oublie pas de prendre les billets.",
            isMine: false,
        },
        { id: "7", text: "Bien sûr, je les ai déjà.", isMine: true },
    ];

    const renderMessage = ({ item }) => {
        const isMine = item.isMine;
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
                    <Text style={styles.messageText}>{item.text}</Text>
                    <Text style={styles.messageTime}>12:48</Text>
                </LinearGradient>
            </View>
        );
    };

    return (
        <ScreenWrapper title="Jean-Michel" showBackButton={true}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <FlatList
                    data={MESSAGES_DATA}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.chatList}
                    inverted
                />

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
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <TouchableOpacity style={styles.sendButton}>
                            <LinearGradient
                                colors={["#1E3A8A", "#3B82F6"]}
                                style={styles.sendGradient}
                            >
                                <SymbolView
                                    name="paperplane.fill"
                                    size={16}
                                    tintColor="#fff"
                                />
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
        paddingBottom: Platform.OS === "ios" ? 30 : 100,
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
