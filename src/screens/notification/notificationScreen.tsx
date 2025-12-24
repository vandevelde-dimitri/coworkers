import React from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../../../utils/supabase";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/authContext";
import {
    useCandidateNotifications,
    useOwnerNotifications,
} from "../../hooks/notification/useNotification";
import { StatusNotification } from "../../types/enum/statusNotification.enum";
import { NotificationResponse } from "../../types/notification.interface";

export default function NotificationsScreen() {
    const { session } = useAuth();

    const {
        data: ownerNotifications,
        isLoading: loadingOwner,
        error: errorOwner,
    } = useOwnerNotifications();

    const {
        data: candidateNotifications,
        isLoading: loadingCandidate,
        error: errorCandidate,
    } = useCandidateNotifications();

    const isLoading = loadingOwner || loadingCandidate;
    const error = errorOwner || errorCandidate;

    const notifications: NotificationResponse[] = [
        ...(ownerNotifications ?? []),
        ...(candidateNotifications ?? []),
    ].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

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

    const onAccept = async (annonceId: string) => {
        if (!session) {
            Alert.alert("Connexion requise");
            return;
        }

        try {
            // 🔹 1. Mettre à jour la candidature
            const { error: updateError } = await supabase
                .from("participant_requests")
                .update({ status: "accepted" })
                .eq("annonce_id", annonceId);

            if (updateError) throw updateError;

            // 🔹 2. Décrémenter le nombre de places
            await supabase.rpc("decrement_places", { annonce: annonceId });

            Alert.alert(
                "Succès",
                "Tu as validé la candidature et la place a été déduite !"
            );
        } catch (e: any) {
            Alert.alert("Erreur", e.message ?? "Impossible de valider");
        }
    };
    const onReject = async (annonceId: string) => {
        if (!session) {
            Alert.alert("Connexion requise");
            return;
        }
        try {
            const { error } = await supabase
                .from("participant_requests")
                .update({ status: "refused" })
                .eq("annonce_id", annonceId);

            if (error) throw error;
            Alert.alert("Succès", "Tu as refusé la candidature !");
        } catch (e: any) {
            Alert.alert("Erreur", e.message ?? "Impossible de refuser");
        }
    };

    const renderItem = ({ item }: { item: NotificationResponse }) => {
        const isOwnerAction = item.status === StatusNotification.PENDING;

        return (
            <View style={[styles.card, isOwnerAction && styles.cardHighlight]}>
                <Text style={styles.message}>{item.message}</Text>

                <Text style={styles.date}>
                    {new Date(item.created_at).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </Text>

                {isOwnerAction && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.accept]}
                            onPress={() => onAccept(item.annonceId)}
                        >
                            <Text style={styles.actionText}>Accepter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, styles.reject]}
                            onPress={() => onReject(item.annonceId)}
                        >
                            <Text style={styles.actionText}>Refuser</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

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
    message: {
        fontSize: 16,
        color: "#111827",
        marginBottom: 6,
    },
    date: {
        fontSize: 13,
        color: "#6B7280",
    },
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
    accept: {
        backgroundColor: "#10B981",
    },
    reject: {
        backgroundColor: "#EF4444",
    },
    actionText: {
        color: "#fff",
        fontWeight: "600",
    },
});
