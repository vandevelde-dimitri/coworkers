import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import SafeScreen from "../../components/SafeScreen";

export default function NotificationsScreen() {
    // 🔹 Fake notifications
    const notifications = [
        {
            id: "1",
            type: "application",
            message: "Alex Dupont a postulé à votre annonce 🚗",
            date: "Il y a 2h",
        },
        {
            id: "2",
            type: "status",
            message:
                "Votre candidature à l’annonce Lille ➝ Amazon a été acceptée ✅",
            date: "Il y a 1j",
        },
        {
            id: "3",
            type: "status",
            message:
                "Votre candidature à l’annonce Paris ➝ Amazon a été refusée ❌",
            date: "Il y a 3j",
        },
    ];

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.card,
                item.type === "application" && styles.cardHighlight,
            ]}
        >
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>{item.date}</Text>

            {item.type === "application" && (
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
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#111827",
    },
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
