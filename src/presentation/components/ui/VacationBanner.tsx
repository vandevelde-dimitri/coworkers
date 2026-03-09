// src/presentation/components/VacationBanner.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const VacationBanner = ({ onPress }: { onPress?: () => void }) => {
  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconBox}>
        <Ionicons name="moon" size={18} color="#FFD700" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Mode vacances activé</Text>
        <Text style={styles.subtitle}>
          Vous n'êtes pas visible des autres membres
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color="rgba(255,255,255,0.4)"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 165, 0, 0.15)",
    margin: 16,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.3)",
  },
  iconBox: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  content: { flex: 1 },
  title: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
});
