import React from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function ApplyConfirmModal({
    visible,
    onClose,
    onConfirm,
    loading,
    error,
}: {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    error?: string;
}) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Confirmer la candidature</Text>
                    <Text style={styles.message}>
                        Voulez-vous vraiment postuler à cette annonce ?
                    </Text>

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <View style={styles.actions}>
                        <Pressable
                            style={styles.cancelBtn}
                            disabled={loading}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelText}>Annuler</Text>
                        </Pressable>

                        <Pressable
                            style={styles.confirmBtn}
                            disabled={loading}
                            onPress={onConfirm}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.confirmText}>
                                    Confirmer
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "white",
        width: 300,
        borderRadius: 12,
        padding: 20,
    },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    message: { fontSize: 15, marginBottom: 15, color: "#333" },
    error: { color: "red", marginBottom: 10 },
    actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
    cancelBtn: { paddingVertical: 8, paddingHorizontal: 15 },
    cancelText: { color: "#555" },
    confirmBtn: {
        backgroundColor: "#10B981",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    confirmText: { color: "white", fontWeight: "600" },
});
