import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { AppButton } from "../../components/ui/AppButton";
import { StackHeader } from "../../components/ui/Header";
import { useAnnouncementDetails } from "../../hooks/queries/useAnnouncementDetails";

export default function AnnouncementDetailScreen({
    announcementId,
}: {
    announcementId: string;
}) {
    const router = useRouter();
    const { data: item, isLoading } = useAnnouncementDetails(announcementId);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#141E30" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: "#6C757D", fontSize: 16 }}>
                    Annonce introuvable
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <StackHeader
                title={`Annonce de ${item.owner.firstName} `}
                showBackButton
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.ownerCard}>
                    <Image
                        source={{ uri: item.owner.profileAvatar }}
                        style={styles.avatar}
                    />
                    <View style={styles.ownerInfo}>
                        <Text style={styles.ownerName}>
                            {item.owner.firstName} {item.owner.lastName}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 8,
                                marginTop: 4,
                            }}
                        >
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {item.owner.fcName}
                                </Text>
                            </View>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {item.owner.settings.toConvey
                                        ? "véhiculé"
                                        : "Pas de véhicule"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.contentCard}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.infoRow}>
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#6C757D"
                        />
                        <Text style={styles.infoText}>
                            Du {item.dateStart.toLocaleDateString("fr-FR")}
                            {item.dateEnd &&
                                ` au ${item.dateEnd.toLocaleDateString("fr-FR")}`}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons
                            name="people-outline"
                            size={20}
                            color="#6C757D"
                        />
                        <Text style={styles.infoText}>
                            {item.places} places disponibles
                        </Text>
                    </View>

                    <View style={styles.separator} />

                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{item.content}</Text>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Passagers ({item.passenger.length})
                    </Text>
                </View>

                {item.passenger.length > 0 ? (
                    item.passenger.map((p) => (
                        <View key={p.id} style={styles.passengerRow}>
                            <Image
                                source={{ uri: p.profileAvatar }}
                                style={styles.passengerAvatar}
                            />
                            <View>
                                <Text style={styles.passengerName}>
                                    {p.firstName}
                                </Text>
                                <Text style={styles.passengerSub}>
                                    {p.city}
                                </Text>
                            </View>
                            <Ionicons
                                name="checkmark-circle"
                                size={24}
                                color="#2DCE89"
                                style={{ marginLeft: "auto" }}
                            />
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyPassengers}>
                        <Text style={styles.emptyText}>
                            Aucun passager pour le moment
                        </Text>
                    </View>
                )}

                <View style={styles.footer}>
                    {true ? (
                        <>
                            <AppButton
                                title="Modifier l'annonce"
                                onPress={() => console.log("Modifier")}
                            />
                            <AppButton
                                variant="danger"
                                title="Supprimer l'annonce"
                                onPress={() => console.log("Supprimer")}
                            />
                        </>
                    ) : (
                        <>
                            <AppButton
                                title="Réserver une place"
                                onPress={() => console.log("Réserver")}
                            />
                            <AppButton
                                variant="secondary"
                                title="Mettre en favoris"
                                onPress={() => console.log("Favoris")}
                            />
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#FFF",
    },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
    backButton: { padding: 8, backgroundColor: "#F1F3F5", borderRadius: 12 },

    scrollContent: { padding: 20, paddingBottom: 150 },

    ownerCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#E9ECEF",
    },
    ownerInfo: { marginLeft: 15 },
    ownerName: { fontSize: 18, fontWeight: "700", color: "#141E30" },
    badge: {
        backgroundColor: "#E7F0FF",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 4,
        alignSelf: "flex-start",
    },
    badgeText: { color: "#007BFF", fontSize: 12, fontWeight: "600" },

    contentCard: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 20,
        marginBottom: 25,
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1A1A1A",
        marginBottom: 15,
    },
    infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    infoText: { marginLeft: 10, color: "#495057", fontSize: 15 },
    separator: { height: 1, backgroundColor: "#F1F3F5", marginVertical: 20 },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 10,
    },
    descriptionText: { fontSize: 15, color: "#6C757D", lineHeight: 22 },

    sectionHeader: { marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
    passengerRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
    },
    passengerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    passengerName: { fontSize: 15, fontWeight: "600", color: "#1A1A1A" },
    passengerSub: { fontSize: 13, color: "#ADB5BD" },

    emptyPassengers: { padding: 20, alignItems: "center" },
    emptyText: { color: "#ADB5BD", fontStyle: "italic" },

    footer: {
        flexDirection: "column",
        gap: 12,
        padding: 20,
    },
    mainButton: {
        backgroundColor: "#141E30",
        paddingVertical: 16,
        borderRadius: 15,
        alignItems: "center",
    },
    mainButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
