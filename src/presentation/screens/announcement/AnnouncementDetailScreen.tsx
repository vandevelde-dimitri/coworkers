import { isMyAnnouncement } from "@/utils/announcementUtils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { RemoveParticipantButton } from "../../components/ui/RemoveParticipantButton";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useAuth } from "../../hooks/authContext";
import { useDeleteAnnouncement } from "../../hooks/mutations/useDeleteAnnouncement";
import { useAnnouncementDetails } from "../../hooks/queries/useAnnouncementDetails";

export default function AnnouncementDetailScreen({
    announcementId,
}: {
    announcementId: string;
}) {
    const router = useRouter();
    const { data: item, isLoading } = useAnnouncementDetails(announcementId);
    const { mutate: deleteAnnouncement } = useDeleteAnnouncement();
    const { session } = useAuth();

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#FFF" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>
                    Annonce introuvable
                </Text>
            </View>
        );
    }
    const isOwner = isMyAnnouncement(item, session?.user.id);

    const handleDelete = (id: string) => () => {
        deleteAnnouncement(id);
        router.replace("/(tabs)/home");
    };

    const handleChange = (id: string) => () => {
        router.push({
            pathname: "/(tabs)/formAnnouncement",
            params: { id: item.id },
        });
    };

    return (
        <ScreenWrapper
            title={item ? `Annonce de ${item.owner.firstName}` : "Détails"}
            showBackButton={true}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.glassCard}>
                    <View style={styles.ownerHeader}>
                        <Image
                            source={{ uri: item.owner.profileAvatar }}
                            style={styles.avatar}
                        />
                        <View style={styles.ownerInfo}>
                            <Text style={styles.ownerName}>
                                {item.owner.firstName} {item.owner.lastName}
                            </Text>
                            <View style={styles.badgeRow}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {item.owner.fcName}
                                    </Text>
                                </View>
                                <View style={[styles.badge, styles.badgeBlue]}>
                                    <Text style={styles.badgeTextBlue}>
                                        {item.owner?.settings.toConvey
                                            ? "Véhiculé"
                                            : "Non-véhiculé"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[styles.glassCard, { marginTop: 20 }]}>
                    <Text style={styles.title}>{item.title}</Text>

                    <View style={styles.infoRow}>
                        <Ionicons
                            name="calendar-outline"
                            size={18}
                            color="rgba(255,255,255,0.5)"
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
                            size={18}
                            color="rgba(255,255,255,0.5)"
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
                            {isOwner && (
                                <RemoveParticipantButton
                                    participant={p}
                                    annonce={item}
                                />
                            )}
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>
                        Aucun passager pour le moment
                    </Text>
                )}

                <View style={styles.footer}>
                    {isOwner ? (
                        <>
                            <AppButton
                                title="Modifier l'annonce"
                                onPress={handleChange(item.id)}
                                variant="primary"
                            />
                            <AppButton
                                title="Supprimer l'annonce"
                                onPress={handleDelete(item.id)}
                                variant="danger"
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
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#141E30" },
    loadingContainer: { justifyContent: "center", alignItems: "center" },

    scrollContent: { padding: 20, paddingBottom: 150 },

    glassCard: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 25,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },

    ownerHeader: { flexDirection: "row", alignItems: "center" },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    ownerInfo: { marginLeft: 15, flex: 1 },
    ownerName: { fontSize: 20, fontWeight: "700", color: "#FFF" },

    badgeRow: { flexDirection: "row", gap: 8, marginTop: 8 },
    badge: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeBlue: { backgroundColor: "rgba(79, 172, 254, 0.2)" },
    badgeText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 11,
        fontWeight: "600",
    },
    badgeTextBlue: { color: "#4FACFE", fontSize: 11, fontWeight: "600" },

    title: { fontSize: 26, fontWeight: "800", color: "#FFF", marginBottom: 20 },
    infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    infoText: { marginLeft: 10, color: "rgba(255,255,255,0.7)", fontSize: 15 },

    separator: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginVertical: 20,
    },

    descriptionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFF",
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 15,
        color: "rgba(255,255,255,0.5)",
        lineHeight: 24,
    },

    sectionHeader: { marginTop: 30, marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#FFF" },

    passengerRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        padding: 14,
        borderRadius: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    passengerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    passengerName: { fontSize: 16, fontWeight: "600", color: "#FFF" },
    passengerSub: { fontSize: 13, color: "rgba(255,255,255,0.4)" },

    emptyText: {
        color: "rgba(255,255,255,0.3)",
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 10,
    },

    footer: { flexDirection: "column", gap: 15, marginTop: 30 },
});
