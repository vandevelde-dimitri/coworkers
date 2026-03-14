import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "./AppButton";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oups !</Text>
      <Text style={styles.description}>
        Une erreur est survenue lors du chargement des données.
      </Text>
      <AppButton title="Réessayer" onPress={onRetry} variant="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#FFF", marginBottom: 10 },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 20,
    textAlign: "center",
  },
});
