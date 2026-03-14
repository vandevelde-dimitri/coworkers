import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IoniconName;
  buttonLabel?: string;
  onPress?: () => void;
}

export const EmptyState = ({
  title,
  description,
  icon = "briefcase-outline",
  buttonLabel,
  onPress,
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name={icon as any}
        size={56}
        color="rgba(255, 255, 255, 0.3)"
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onPress && buttonLabel && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
    minHeight: 300,
  },
  icon: {
    marginBottom: 20,
    opacity: 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 15,
  },
  buttonText: {
    fontWeight: "600",
    color: "#FFFFFF",
    fontSize: 14,
  },
});
