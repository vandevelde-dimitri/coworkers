import NetInfo from "@react-native-community/netinfo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const NetworkBanner = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (isConnected !== false) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <LinearGradient colors={["#78350f", "#92400e"]} style={styles.banner}>
        <Text style={styles.text}>
          Mode hors-ligne • En attente de connexion
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 9999,
  },
  banner: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fef3c7",
    fontWeight: "600",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
