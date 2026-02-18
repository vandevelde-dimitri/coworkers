import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function MessagingScreen() {
    const router = useRouter();
    const DUMMY_DATA = [
        {
            id: "1",
            name: "Jean-Michel",
            lastMessage: "Salut, ça va ?",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            unread: 2,
        },
        {
            id: "2",
            name: "Sophie",
            lastMessage: "On se voit demain ?",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            unread: 0,
        },
        {
            id: "3",
            name: "Alex",
            lastMessage: "J'ai une question sur l'annonce.",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            unread: 1,
        },
    ];

    const renderConversation = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                router.push("/(tabs)/messaging/[id]");
            }}
        >
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
                            source={{ uri: item.avatar }}
                            style={styles.avatar}
                        />
                        {item.unread > 0 && <View style={styles.unreadDot} />}
                    </View>
                    <View style={styles.textSection}>
                        <View style={styles.nameRow}>
                            <Text style={styles.userNameText}>{item.name}</Text>
                            <Text style={styles.dateText}>12:45</Text>
                        </View>
                        <Text style={styles.previewText} numberOfLines={1}>
                            {item.lastMessage}
                        </Text>
                    </View>
                    <SymbolView
                        name="chevron.right"
                        size={14}
                        tintColor="rgba(255, 255, 255, 0.3)"
                    />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper title="Messages" showBackButton={false}>
            <FlatList
                data={DUMMY_DATA}
                renderItem={renderConversation}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 20,
    },
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
