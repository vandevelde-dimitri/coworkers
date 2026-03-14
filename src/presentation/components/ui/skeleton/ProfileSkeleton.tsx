import React from "react";
import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerGroup } from "../molecules/shimmer/Shimmer";

export default function ProfileSkeleton() {
  return (
    <ShimmerGroup isLoading={true} preset="neutral">
      <View style={styles.container}>
        <View style={styles.headerSkeleton}>
          <Shimmer style={styles.avatar} />
          <Shimmer style={styles.name} />
        </View>

        <View style={styles.bentoGrid}>
          <Shimmer style={styles.bento} />
          <Shimmer style={styles.bento} />
        </View>

        <Shimmer style={styles.sectionTitle} />
        <Shimmer style={styles.menuItem} />
        <Shimmer style={styles.menuItem} />
      </View>
    </ShimmerGroup>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerSkeleton: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 15,
  },
  name: {
    width: 150,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  bentoGrid: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
    justifyContent: "center",
  },
  bento: {
    width: "45%",
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  sectionTitle: {
    width: 100,
    height: 18,
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  menuItem: {
    width: "100%",
    height: 60,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
});
