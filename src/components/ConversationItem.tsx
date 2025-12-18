import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ConversationItem({ item, onPress }: any) {
    console.log("item", item);

    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            {item.image_profile ? (
                <Image
                    source={{ uri: item.image_profile }}
                    style={styles.avatar}
                />
            ) : (
                <View style={styles.avatarFallback}>
                    <Text style={styles.avatarText}>
                        {item.title?.[0]?.toUpperCase()}
                    </Text>
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.name}>{item.annonce_title}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.last_message}
                </Text>
            </View>

            <View style={styles.right}>
                {item.time && <Text style={styles.time}>{item.time}</Text>}
                {item.unread && <View style={styles.badge} />}
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
        backgroundColor: "#3B82F6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "white",
        fontWeight: "600",
        fontSize: 18,
    },
    content: {
        flex: 1,
    },
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
    avatarFallback: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#3B82F6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
});
