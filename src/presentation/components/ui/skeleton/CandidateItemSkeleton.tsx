import React from "react";
import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerGroup } from "../molecules/shimmer/Shimmer";

export default function CandidateItemSkeleton() {
  return (
    <ShimmerGroup isLoading={true} preset="neutral">
      <View style={styles.glassCard}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Shimmer style={styles.title} />
            <Shimmer style={styles.date} />
          </View>
          <Shimmer style={styles.statusBadge} />
        </View>

        <View style={styles.divider} />

        <View style={styles.actionRow}>
          <Shimmer style={styles.detailsButton} />
          <Shimmer style={styles.mainAction} />
        </View>
      </View>
    </ShimmerGroup>
  );
}

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleContainer: { flex: 1, gap: 8 },
  title: {
    width: "70%",
    height: 18,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  date: {
    width: "40%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  statusBadge: {
    width: 80,
    height: 26,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 16,
  },
  actionRow: { flexDirection: "row", gap: 12 },
  detailsButton: {
    flex: 0.4,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  mainAction: {
    flex: 0.6,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
