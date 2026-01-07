// src/screens/home/TravelScreen.tsx
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { formatDate } from "../../../utils/formatedDate";
import SafeScreen from "../../components/SafeScreen";
import { Avatar } from "../../components/ui/Avatar";
import { Card } from "../../components/ui/Card";
import {
    useAnnouncementCurrentUser,
    useDeleteAnnouncement,
} from "../../hooks/announcement/useAnnouncement";

export default function TravelScreen() {
    const navigation = useNavigation();
    const {
        data: announcement,
        isLoading,
        error,
    } = useAnnouncementCurrentUser();

    // Hooks must be called unconditionally — placer la mutation en haut
    const deleteMutation = useDeleteAnnouncement();

    // 1️⃣ Loading
    if (isLoading) {
        return (
            <SafeScreen title="Mon annonce">
                <Text>Chargement...</Text>
            </SafeScreen>
        );
    }

    // 2️⃣ Erreur
    if (error) {
        return (
            <SafeScreen title="Mon annonce">
                <Text>Une erreur est survenue.</Text>
            </SafeScreen>
        );
    }

    // 3️⃣ Aucune annonce → bouton créer
    if (!announcement) {
        return (
            <SafeScreen title="Mon annonce">
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Vous n'avez pas encore créé d'annonce.
                    </Text>

                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() =>
                            (navigation as any).navigate("FormStack", {
                                screen: "FormAnnouncementScreen",
                            })
                        }
                    >
                        <Text style={styles.buttonPrimaryText}>
                            Créer une annonce
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeScreen>
        );
    }

    // ---------- ACTIONS ----------
    const handleEdit = () => {
        (navigation as any).navigate("FormStack", {
            screen: "FormAnnouncementScreen",
            params: { id: announcement.id },
        });
    };

    const handleDelete = () => {
        Alert.alert(
            "Supprimer l'annonce",
            "Êtes-vous sûr de vouloir supprimer votre annonce ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteMutation.mutateAsync(announcement.id);
                            (navigation as any).navigate("HomeStack", {
                                screen: "HomeScreen",
                            });
                        } catch (err) {
                            Alert.alert(
                                "Erreur",
                                "Impossible de supprimer l'annonce."
                            );
                        }
                    },
                },
            ]
        );
    };

    // ---------- FORMATTING ----------
    const dateStart = formatDate(announcement.date_start);
    const dateEnd = announcement.date_end
        ? formatDate(announcement.date_end)
        : null;

    // ---------- RENDER ----------
    return (
        <ScrollView style={{ padding: 16 }}>
            <Card>
                <Text
                    style={{ fontSize: 20, fontWeight: "700", marginBottom: 6 }}
                >
                    {announcement.title}
                </Text>
                <Text style={{ color: "#374151" }}>{announcement.content}</Text>
                {/* <Text style={{ marginTop: 6, color: "#6b7280" }}>
                            Départ : 12 Jan · 08:00
                        </Text> */}
                <Text style={{ marginTop: 6 }}>
                    Places disponibles : {announcement.number_of_places}
                </Text>
            </Card>

            <Card>
                <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                    Annonce de
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar uri="https://i.pravatar.cc/150?img=12" />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontWeight: "600" }}>
                            {announcement.users.firstname}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#6b7280" }}>
                            {announcement.users.city}
                        </Text>
                    </View>
                </View>
            </Card>

            <Card>
                <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                    Participants
                </Text>
                {[1, 2].map((p) => (
                    <View
                        key={p}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 12,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                uri={`https://i.pravatar.cc/150?img=${30 + p}`}
                            />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={{ fontWeight: "500" }}>
                                    Participant {p}
                                </Text>
                                <Text
                                    style={{ fontSize: 12, color: "#22c55e" }}
                                >
                                    Accepté
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#fee2e2",
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#ef4444",
                                    fontSize: 12,
                                    fontWeight: "600",
                                }}
                            >
                                Retirer
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </Card>

            <TouchableOpacity
                onPress={handleEdit}
                style={{
                    backgroundColor: "#f59e0b",
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 10,
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    Modifier
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleDelete}
                style={{
                    backgroundColor: "#ef4444",
                    padding: 16,
                    borderRadius: 16,
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    Supprimer
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: { padding: 16 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },

    // --- EMPTY ---
    emptyContainer: {
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    emptyText: { fontSize: 16, marginBottom: 12 },

    // --- TEXT ---
    title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
    contentText: { fontSize: 15, marginBottom: 8, color: "#333" },
    dates: { fontSize: 13, color: "#888", marginBottom: 4 },
    places: { fontSize: 14, fontWeight: "600", marginBottom: 12 },

    // --- USER ---
    userSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
    },
    userName: { fontSize: 16, fontWeight: "600" },
    city: { fontSize: 13, color: "#999" },

    // --- VEHICLE ---
    noVehicle: {
        color: "#ff0000",
        fontWeight: "600",
        marginBottom: 12,
    },

    // --- BUTTONS ---
    actions: { gap: 12, marginTop: 12 },

    buttonPrimary: {
        backgroundColor: "#10B981",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonPrimaryText: { color: "#fff", fontWeight: "600" },

    buttonDelete: {
        backgroundColor: "#EF4444",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonDeleteText: { color: "#fff", fontWeight: "600" },
});
