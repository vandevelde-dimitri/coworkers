import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "./AppButton";

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
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon as any}
          size={64}
          color="rgba(255, 255, 255, 0.4)"
          style={styles.icon}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onPress && buttonLabel && (
        <AppButton
          title={buttonLabel}
          onPress={onPress}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 60,
    minHeight: 350,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.75,
  },
  icon: {
    opacity: 0.7,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    minWidth: 200,
  },
});
