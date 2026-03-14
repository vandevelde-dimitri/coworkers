import React from "react";
import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerGroup } from "../molecules/shimmer/Shimmer";

export default function AnnouncementCardSkeleton() {
  return (
    <View style={styles.cardContainer}>
      <ShimmerGroup isLoading={true} preset="neutral" duration={1000}>
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
            <View style={styles.tagsRow}>
              <Shimmer style={styles.skeletonTag} />
              <Shimmer style={styles.skeletonTag} />
            </View>
            <Shimmer style={styles.actionButton} />
          </View>
        </View>
      </ShimmerGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { marginBottom: 16 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  driverSection: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  infoLines: { gap: 6 },
  skeletonName: {
    width: 100,
    height: 16,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skeletonDate: {
    width: 60,
    height: 10,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  placesBadge: {
    width: 80,
    height: 26,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  cardContent: { marginVertical: 18, gap: 8 },
  skeletonTitle: {
    width: "70%",
    height: 22,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skeletonSubtitle: {
    width: "100%",
    height: 14,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  tagsRow: { flexDirection: "row", gap: 8 },
  skeletonTag: {
    width: 60,
    height: 14,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  actionButton: {
    width: 80,
    height: 34,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
