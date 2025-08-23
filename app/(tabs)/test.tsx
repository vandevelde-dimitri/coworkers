import React, { useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Conversation = {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    avatar: string;
    unread?: number;
};

export default function ConversationsScreen({ navigation }: any) {
    const [conversations] = useState<Conversation[]>([
        {
            id: "1",
            name: "Jean Dupont",
            lastMessage: "Yes parfait à 8h devant le FC 👍",
            time: "10:02",
            avatar: "https://i.pravatar.cc/150?img=1",
            unread: 2,
        },
        {
            id: "2",
            name: "Marie Curie",
            lastMessage: "Super merci !",
            time: "09:45",
            avatar: "https://i.pravatar.cc/150?img=2",
        },
        {
            id: "3",
            name: "FC Lille Team",
            lastMessage: "On part ensemble demain",
            time: "Hier",
            avatar: "https://i.pravatar.cc/150?img=3",
        },
    ]);

    return (
        <View style={styles.container}>
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() =>
                            navigation.navigate("Chat", { id: item.id })
                        }
                    >
                        <Image
                            source={{ uri: item.avatar }}
                            style={styles.avatar}
                        />
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                            <View style={styles.footer}>
                                <Text
                                    style={styles.lastMessage}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.lastMessage}
                                </Text>
                                {item.unread && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {item.unread}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    row: {
        flexDirection: "row",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: "#f3f4f6",
        alignItems: "center",
    },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    content: { flex: 1 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    name: { fontSize: 16, fontWeight: "600", color: "#111827" },
    time: { fontSize: 12, color: "#6b7280" },
    footer: { flexDirection: "row", justifyContent: "space-between" },
    lastMessage: { flex: 1, fontSize: 14, color: "#6b7280" },
    badge: {
        backgroundColor: "#10B981",
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },
    badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
