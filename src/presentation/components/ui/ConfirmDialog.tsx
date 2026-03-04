import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { AppButton } from "./AppButton";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

export default function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.glassCard}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: danger
                  ? "rgba(255, 69, 58, 0.15)"
                  : "rgba(79, 172, 254, 0.15)",
              },
            ]}
          >
            <Ionicons
              name={danger ? "alert-circle" : "help-circle"}
              size={32}
              color={danger ? "#FF453A" : "#4FACFE"}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>

          <View style={styles.buttonRow}>
            <View style={{ flex: 1 }}>
              <AppButton
                title={cancelLabel}
                onPress={onCancel}
                variant="secondary"
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton
                title={confirmLabel}
                onPress={onConfirm}
                variant={danger ? "danger" : "primary"}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  glassCard: {
    width: "100%",
    backgroundColor: "rgba(30, 30, 35, 0.95)",
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  content: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
});
