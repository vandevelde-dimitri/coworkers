import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ConversationPreview } from "../api/user/getUserConversations";

export default function ConversationItem({
    item,
    unread,
    onPress,
}: {
    item: ConversationPreview;
    unread: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            <View style={styles.avatar}>
                {item.image_profile ? (
                    <Text style={styles.avatarText}>👤</Text>
                ) : (
                    <Text style={styles.avatarText}>
                        {item.annonce_title?.[0]?.toUpperCase() ?? "?"}
                    </Text>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.name}>{item.annonce_title}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.last_message ?? "Aucun message"}
                </Text>
            </View>

            <View style={styles.right}>
                <Text style={styles.time}>
                    {item.last_message_time
                        ? new Date(item.last_message_time).toLocaleTimeString(
                              "fr-FR",
                              { hour: "2-digit", minute: "2-digit" }
                          )
                        : ""}
                </Text>

                {unread && <View style={styles.badge} />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        padding: 14,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "center",
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#10B981",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "white",
        fontWeight: "600",
        fontSize: 18,
    },
    content: { flex: 1 },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    lastMessage: {
        color: "#6B7280",
        marginTop: 2,
    },
    right: {
        alignItems: "flex-end",
        gap: 6,
    },
    time: {
        color: "#9CA3AF",
        fontSize: 12,
    },
    badge: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#EF4444",
    },
});
