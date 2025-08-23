import SafeScreen from "@/components/SafeScreen";
import { useAnnouncementById } from "@/hooks/announcement/useAnnouncement";
import { Contract } from "@/types/enum/contract.enum";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AnnouncementDetail() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    console.log("Announcement ID:", id);
    const { data, isLoading, error } = useAnnouncementById(id as string);

    const onApply = () => {
        console.log("Apply to announcement:", id);
        // Logique pour postuler à l'annonce
    };

    const onFavorite = () => {
        console.log("Add to favorites:", id);
        // Logique pour ajouter aux favoris
    };

    if (!data) {
        return (
            <SafeScreen>
                <Text>Announcement not found</Text>
            </SafeScreen>
        );
    }

    if (isLoading) {
        return (
            <SafeScreen>
                <Text>Loading...</Text>
            </SafeScreen>
        );
    }

    if (error) {
        console.error("Error fetching announcements:", error);
        return (
            <SafeScreen>
                <Text>Error loading announcements</Text>
            </SafeScreen>
        );
    }
    return (
        <SafeScreen title={`Annonce de ${data.users.firstname}`} backBtn={true}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.title}>{data.title}</Text>
                    <View
                        style={[
                            styles.badge,
                            {
                                backgroundColor:
                                    data.number_of_places > 0
                                        ? "#10B981"
                                        : "#EF4444",
                            },
                        ]}
                    >
                        <Text style={styles.badgeText}>
                            {data.number_of_places > 0
                                ? "Disponible"
                                : "Complet"}
                        </Text>
                    </View>
                </View>

                <Text style={styles.content}>{data.content}</Text>

                {data.date_start && (
                    <Text style={styles.dates}>
                        Du {data.date_start}{" "}
                        {data.date_end ? `au ${data.date_end}` : ""}
                    </Text>
                )}

                <Text style={styles.places}>
                    {data.number_of_places} place(s) restantes
                </Text>

                <View style={styles.userInfo}>
                    <Image
                        source={{
                            uri:
                                data.image_profile ||
                                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=facearea&w=256&h=256&q=80",
                        }}
                        style={[
                            styles.avatar,
                            data.contract === Contract.CDI
                                ? { borderColor: "#1D4ED8" }
                                : data.contract === Contract.CDD
                                ? { borderColor: "#10B981" }
                                : { borderColor: "#6B7280" },
                        ]}
                    />
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{data.user_name}</Text>
                        {data.team && (
                            <Text style={styles.userTeam}>{data.team}</Text>
                        )}
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={onApply}
                    >
                        <Text style={styles.applyText}>Postuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={onFavorite}
                    >
                        <Text style={styles.favoriteText}>
                            Ajouter aux favoris
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    title: { fontSize: 18, fontWeight: "700", color: "#111827" },
    badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
    badgeText: { color: "#fff", fontWeight: "600", fontSize: 12 },
    content: { fontSize: 14, color: "#2f2f2f", marginBottom: 8 },
    dates: { fontSize: 12, color: "#6b7280", marginBottom: 8 },
    places: { fontSize: 14, fontWeight: "600", marginBottom: 12 },
    userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        marginRight: 12,
    },
    userDetails: {},
    userName: { fontWeight: "700", fontSize: 14 },
    userTeam: { fontSize: 12, color: "#6b7280" },
    actions: { flexDirection: "row", justifyContent: "space-between" },
    applyButton: {
        flex: 1,
        backgroundColor: "#1D4ED8",
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
    },
    applyText: { color: "#fff", fontWeight: "700", textAlign: "center" },
    favoriteButton: {
        flex: 1,
        borderColor: "#1D4ED8",
        borderWidth: 2,
        padding: 12,
        borderRadius: 8,
    },
    favoriteText: { color: "#1D4ED8", fontWeight: "700", textAlign: "center" },
});
