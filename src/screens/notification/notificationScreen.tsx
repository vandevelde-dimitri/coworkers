import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";
import { useAllNotificationByUser } from "../../hooks/notification/useNotification";
import { StatusNotification } from "../../types/enum/statusNotification.enum";
import { FormattedNotification } from "../../types/notification.interface";

export default function NotificationsScreen() {
    const {
        data: notifications,
        isLoading,
        error,
    } = useAllNotificationByUser();

    if (isLoading) {
        return (
            <SafeScreen backBtn title="Notifications">
                <Text>Chargement des notifications...</Text>
            </SafeScreen>
        );
    }

    if (error) {
        console.log("RQ ERROR:", error);
        return (
            <SafeScreen backBtn title="Notifications">
                <Text>Erreur lors du chargement des notifications.</Text>
            </SafeScreen>
        );
    }

    const renderItem = ({ item }: { item: FormattedNotification }) => (
        <View
            style={[
                styles.card,
                item.status === StatusNotification.PENDING &&
                    styles.cardHighlight,
            ]}
        >
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>
                {new Date(item.created_at).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                })}
            </Text>

            {/* Si le statut = pending → afficher boutons Accepter / Refuser */}
            {item.status === StatusNotification.PENDING && (
                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.actionBtn, styles.accept]}>
                        <Text style={styles.actionText}>Accepter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionBtn, styles.reject]}>
                        <Text style={styles.actionText}>Refuser</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <SafeScreen backBtn title="Notifications">
            <FlatList
                data={notifications ?? []}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#F9FAFB",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    cardHighlight: {
        borderColor: "#10B981",
        backgroundColor: "#ECFDF5",
    },
    message: { fontSize: 16, color: "#111827", marginBottom: 6 },
    date: { fontSize: 13, color: "#6B7280" },
    actions: {
        flexDirection: "row",
        marginTop: 12,
        gap: 8,
    },
    actionBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    accept: { backgroundColor: "#10B981" },
    reject: { backgroundColor: "#EF4444" },
    actionText: { color: "#fff", fontWeight: "600" },
});
