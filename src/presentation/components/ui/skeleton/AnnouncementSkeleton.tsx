import React from "react";
import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerGroup } from "../molecules/shimmer/Shimmer";

export default function AnnouncementCardSkeleton() {
    return (
        <View style={styles.cardContainer}>
            <ShimmerGroup
                isLoading={true}
                preset="neutral"
                duration={1000}
                direction="leftToRight"
            >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.driverSection}>
                            <Shimmer style={styles.avatarCircle} />
                            <View style={styles.infoLines}>
                                <Shimmer style={styles.skeletonName} />
                                <Shimmer style={styles.skeletonDate} />
                            </View>
                        </View>
                        <Shimmer style={styles.placesBadge} />
                    </View>

                    <View style={styles.cardContent}>
                        <Shimmer style={styles.skeletonTitle} />
                        <Shimmer style={styles.skeletonSubtitle} />
                        <Shimmer style={styles.skeletonSubtitle} />
                    </View>

                    <View style={styles.cardFooter}>
                        <View />
                        <Shimmer style={styles.actionButton} />
                    </View>
                </View>
            </ShimmerGroup>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 20,
        borderRadius: 28,
        overflow: "hidden",
    },
    card: {
        backgroundColor: "#E2E8F0",
        padding: 20,
        height: 200,
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
        backgroundColor: "#CBD5E1",
    },
    infoLines: { gap: 6 },
    skeletonName: {
        width: 100,
        height: 14,
        borderRadius: 4,
        backgroundColor: "#CBD5E1",
    },
    skeletonDate: {
        width: 60,
        height: 10,
        borderRadius: 4,
        backgroundColor: "#CBD5E1",
    },
    placesBadge: {
        width: 75,
        height: 24,
        borderRadius: 10,
        backgroundColor: "#CBD5E1",
    },
    cardContent: { marginVertical: 20, gap: 10 },
    skeletonTitle: {
        width: "80%",
        height: 22,
        borderRadius: 6,
        backgroundColor: "#CBD5E1",
    },
    skeletonSubtitle: {
        width: "100%",
        height: 12,
        borderRadius: 4,
        backgroundColor: "#CBD5E1",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    actionButton: {
        width: 110,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#CBD5E1",
    },
});
