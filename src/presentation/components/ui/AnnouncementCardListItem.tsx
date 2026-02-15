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
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
            <LinearGradient
                colors={[
                    "rgba(255, 255, 255, 0.08)",
                    "rgba(255, 255, 255, 0.03)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.driverSection}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: item.owner?.profileAvatar }}
                                style={styles.avatar}
                            />
                        </View>
                        <View>
                            <View style={styles.nameRow}>
                                <Text style={styles.driverName}>
                                    {item.owner?.firstName}
                                </Text>
                                <View
                                    style={[
                                        styles.carBadge,
                                        {
                                            backgroundColor: item.owner
                                                ?.settings.toConvey
                                                ? "rgba(79, 172, 254, 0.2)"
                                                : "rgba(255,255,255,0.1)",
                                        },
                                    ]}
                                >
                                    <SymbolView
                                        name="car.fill"
                                        size={10}
                                        tintColor={
                                            item.owner?.settings.toConvey
                                                ? "#4FACFE"
                                                : "#FFF"
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.carBadgeText,
                                            {
                                                color: item.owner?.settings
                                                    .toConvey
                                                    ? "#4FACFE"
                                                    : "#FFF",
                                            },
                                        ]}
                                    >
                                        {item.owner?.settings.toConvey
                                            ? "Conducteur"
                                            : "Passager"}
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
                    <View style={styles.tagsRow}>
                        {/* On peut imaginer des petits tags ici */}
                        <Text style={styles.tagText}>#LIL1</Text>
                    </View>
                    <View style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Voir</Text>
                        <SymbolView
                            name="chevron.right"
                            size={12}
                            tintColor="#fff"
                        />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 30,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    driverSection: { flexDirection: "row", alignItems: "center", gap: 12 },
    avatarWrapper: {
        padding: 2,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
    },
    nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    driverName: { color: "#fff", fontWeight: "700", fontSize: 16 },
    dateText: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 },

    carBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    carBadgeText: {
        fontSize: 9,
        fontWeight: "800",
        textTransform: "uppercase",
    },

    placesBadge: {
        backgroundColor: "#FFF",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    placesText: { color: "#141E30", fontWeight: "800", fontSize: 12 },

    cardContent: { marginVertical: 18 },
    cardTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.6)",
        lineHeight: 20,
    },

    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
    },
    tagsRow: { flexDirection: "row", gap: 8 },
    tagText: {
        color: "rgba(255,255,255,0.3)",
        fontSize: 12,
        fontWeight: "600",
    },

    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 14,
    },
    actionButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
