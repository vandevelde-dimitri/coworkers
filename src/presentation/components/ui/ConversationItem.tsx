import { Conversation } from "@/src/domain/entities/chat/Conversation";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function ConversationItem({
    item,
    unread,
    onPress,
}: {
    item: Conversation;
    unread: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <LinearGradient
                colors={[
                    "rgba(255, 255, 255, 0.08)",
                    "rgba(255, 255, 255, 0.03)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.cardContent}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: item.interlocutor.avatarUrl }}
                            style={styles.avatar}
                        />
                        {unread && <View style={styles.unreadDot} />}
                    </View>
                    <View style={styles.textSection}>
                        <View style={styles.nameRow}>
                            <Text style={styles.userNameText}>
                                {item.interlocutor.firstName}{" "}
                                {item.interlocutor.lastName}
                            </Text>
                            <Text style={styles.dateText}>12:45</Text>
                        </View>
                        <Text style={styles.previewText} numberOfLines={1}>
                            {item.lastMessage}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 25,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarWrapper: {
        position: "relative",
        padding: 2,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    unreadDot: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#4FACFE",
        borderWidth: 2,
        borderColor: "#141E30",
    },
    textSection: {
        flex: 1,
        marginLeft: 15,
        gap: 4,
    },
    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userNameText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
    },
    dateText: {
        fontSize: 12,
        color: "rgba(255,255,255,0.4)",
    },
    previewText: {
        fontSize: 14,
        color: "rgba(255,255,255,0.6)",
    },
});
