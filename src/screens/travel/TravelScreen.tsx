// src/screens/home/TravelScreen.tsx
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { formatDate } from "../../../utils/formatedDate";
import SafeScreen from "../../components/SafeScreen";
import {
    useAnnouncementCurrentUser,
    useDeleteAnnouncement,
} from "../../hooks/announcement/useAnnouncement";
import { Contract } from "../../types/enum/contract.enum";

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
        <SafeScreen title="Mon annonce">
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    {/* Titre */}
                    <Text style={styles.title}>{announcement.title}</Text>

                    {/* USER */}
                    <View style={styles.userSection}>
                        <Image
                            source={{
                                uri:
                                    announcement.users.image_profile ||
                                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
                            }}
                            style={[
                                styles.avatar,
                                announcement.users.contract === Contract.CDI
                                    ? { borderColor: "#1D4ED8" }
                                    : { borderColor: "#10B981" },
                            ]}
                        />

                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.userName}>
                                {announcement.users.firstname}
                            </Text>
                            <Text style={styles.city}>
                                {announcement.users.city}
                            </Text>
                        </View>
                    </View>

                    {/* DESCRIPTION */}
                    <Text style={styles.contentText}>
                        {announcement.content}
                    </Text>

                    {/* DATES */}
                    {announcement.date_start && (
                        <Text style={styles.dates}>
                            {dateEnd
                                ? `Du ${dateStart} au ${dateEnd}`
                                : `À partir du ${dateStart}`}
                        </Text>
                    )}

                    {/* PLACES */}
                    <Text
                        style={[
                            styles.places,
                            announcement.number_of_places === 0 && {
                                color: "#ff0000",
                            },
                        ]}
                    >
                        {announcement.number_of_places} place
                        {announcement.number_of_places > 1 ? "s" : ""}{" "}
                        disponible
                    </Text>

                    {/* NO VEHICLE */}
                    {!announcement.users.to_convey && (
                        <Text style={styles.noVehicle}>🚫 Pas de véhicule</Text>
                    )}

                    {/* ACTIONS */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.buttonPrimary}
                            onPress={handleEdit}
                        >
                            <Text style={styles.buttonPrimaryText}>
                                Modifier
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonDelete}
                            onPress={handleDelete}
                        >
                            <Text style={styles.buttonDeleteText}>
                                Supprimer
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeScreen>
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
