import React from "react";
import { StyleSheet, View } from "react-native";
import { Shimmer, ShimmerGroup } from "../molecules/shimmer/Shimmer";

export default function AnnouncementOwnerSkeleton() {
  return (
    <ShimmerGroup isLoading={true} preset="neutral">
      <View style={styles.scrollContent}>
        <View style={styles.glassCard}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Shimmer style={styles.avatar} />
            <View style={{ marginLeft: 15, gap: 8 }}>
              <Shimmer style={{ width: 150, height: 20, borderRadius: 6 }} />
              <Shimmer style={{ width: 100, height: 16, borderRadius: 6 }} />
            </View>
          </View>
        </View>

        <View style={[styles.glassCard, { marginTop: 20, height: 250 }]}>
          <Shimmer
            style={{
              width: "90%",
              height: 26,
              borderRadius: 6,
              marginBottom: 20,
            }}
          />
          <Shimmer style={{ width: "60%", height: 18, marginBottom: 12 }} />
          <Shimmer style={{ width: "40%", height: 18, marginBottom: 20 }} />
          <Shimmer style={{ width: "100%", height: 100, borderRadius: 12 }} />
        </View>

        <Shimmer
          style={{ width: 120, height: 20, marginTop: 30, marginBottom: 15 }}
        />
        <Shimmer style={styles.passengerRow} />
      </View>
    </ShimmerGroup>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  passengerRow: {
    height: 72,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 10,
  },
});
