import FeatherIcon from "@expo/vector-icons/Feather";
import React from "react";
import { Modal, Text, View } from "react-native";
import Button from "./Button";

type ConfirmModalProps = {
    visible: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
};

export default function ConfirmModal({
    visible,
    title,
    description,
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
    onConfirm,
    onCancel,
    danger = false,
}: ConfirmModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                }}
            >
                <View
                    style={{
                        width: "100%",
                        backgroundColor: "#fff",
                        borderRadius: 20,
                        padding: 20,
                        shadowColor: "#000",
                        shadowOpacity: 0.15,
                        shadowRadius: 10,
                    }}
                >
                    {/* Icon */}
                    <View
                        style={{
                            alignSelf: "center",
                            marginBottom: 12,
                        }}
                    >
                        <FeatherIcon
                            name={danger ? "alert-triangle" : "help-circle"}
                            size={36}
                            color={danger ? "#EF4444" : "#2563EB"}
                        />
                    </View>

                    {/* Title */}
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "700",
                            textAlign: "center",
                            color: "#111827",
                        }}
                    >
                        {title}
                    </Text>

                    {/* Description */}
                    {description && (
                        <Text
                            style={{
                                textAlign: "center",
                                color: "#6B7280",
                                marginTop: 8,
                                marginBottom: 20,
                            }}
                        >
                            {description}
                        </Text>
                    )}

                    {/* Actions */}
                    <View style={{ gap: 10 }}>
                        <Button
                            label={confirmLabel}
                            variant={danger ? "danger" : "primary"}
                            onPress={onConfirm}
                        />
                        <Button
                            label={cancelLabel}
                            variant="secondary"
                            onPress={onCancel}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
