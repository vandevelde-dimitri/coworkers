import { Announcement } from "@/src/domain/entities/announcement/Announcement";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function AnnouncementCardListItem({
    item,
    onPress,
}: {
    item: Announcement;
    onPress: () => void;
}) {
    const dateStr = new Date(item.dateStart).toLocaleDateString("fr-FR");
    return (
        <View>
            <LinearGradient
                colors={["#243B55", "#141E30"]}
                // colors={["#FF0844", "#FFB199"]}
                // colors={["#667EEA", "#764BA2"]}
                // colors={["#4FACFE", "#00F2FE"]}
                // colors={["#141414", "#000000"]}
                // colors={["#FF0080", "#7928CA"]}
                // colors={["#00DBDE", "#FC00FF"]}
                // colors={["#007AFF", "#00D2FF"]}
                // colors={["#12b4e6", "#1A1A1A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.driverSection}>
                        <View style={styles.avatarCircle}>
                            <Image
                                source={{ uri: item.owner.profileAvatar }}
                                style={styles.avatar}
                            />
                        </View>
                        <View>
                            <View style={styles.nameRow}>
                                <Text style={styles.driverName}>
                                    {item.owner.firstName}
                                </Text>
                                <View style={styles.carBadge}>
                                    <SymbolView
                                        name="car.fill"
                                        size={10}
                                        tintColor="#fff"
                                    />
                                    <Text style={styles.carBadgeText}>
                                        {item.owner.settings.toConvey
                                            ? "Véhiculé"
                                            : "Pas de véhicule"}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.dateText}>{dateStr}</Text>
                        </View>
                    </View>
                    <View style={styles.placesBadge}>
                        <Text style={styles.placesText}>
                            {item.places} places
                        </Text>
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle} numberOfLines={2}>
                        {item.content}
                    </Text>
                </View>

                <View style={styles.cardFooter}>
                    <View />
                    <TouchableOpacity
                        onPress={onPress}
                        style={styles.actionButton}
                    >
                        <Text style={styles.actionButtonText}>
                            Voir détails
                        </Text>
                        <SymbolView
                            name="chevron.right"
                            size={12}
                            tintColor="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 28,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    driverSection: { flexDirection: "row", alignItems: "center", gap: 10 },
    avatarCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: "#E9ECEF",
    },
    driverName: { color: "#fff", fontWeight: "700", fontSize: 15 },
    dateText: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
    placesBadge: {
        backgroundColor: "rgba(255,255,255,0.25)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    placesText: { color: "#fff", fontWeight: "700", fontSize: 11 },
    cardContent: { marginVertical: 15 },
    cardTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.85)",
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(0,0,0,0.15)",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    actionButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    carBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    carBadgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "600",
        textTransform: "uppercase",
    },
});
