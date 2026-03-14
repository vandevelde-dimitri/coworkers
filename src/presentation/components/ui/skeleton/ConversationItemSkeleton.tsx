import React from "react";
import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerGroup } from "../molecules/shimmer/Shimmer";

export default function ConversationItemSkeleton() {
  return (
    <View style={styles.cardContainer}>
      <ShimmerGroup isLoading={true} preset="neutral" duration={1000}>
        <View style={styles.container}>
          <Shimmer style={styles.avatar} />

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Shimmer style={styles.name} />
              <Shimmer style={styles.time} />
            </View>

            <Shimmer style={styles.message} />
          </View>
        </View>
      </ShimmerGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { marginBottom: 16 },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.03)",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    flex: 1,
    marginLeft: 16,
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    width: "40%",
    height: 16,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  time: {
    width: "15%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  message: {
    width: "70%",
    height: 14,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
});
