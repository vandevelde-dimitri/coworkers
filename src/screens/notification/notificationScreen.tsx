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
import { addUserConversation } from "../../api/messaging/addUserConversation";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/authContext";
import { useAcceptRequest } from "../../hooks/candidate/useCandidate";
import {
    useCandidateNotifications,
    useOwnerNotifications,
} from "../../hooks/notification/useNotification";
import { StatusNotification } from "../../types/enum/statusNotification.enum";
import { NotificationResponse } from "../../types/notification.interface";

export default function NotificationsScreen() {
    const { session } = useAuth();

    const ownerQuery = useOwnerNotifications();
    const candidateQuery = useCandidateNotifications();
    const { mutateAsync: acceptRequest, isPending } = useAcceptRequest();

    const isLoading = ownerQuery.isLoading || candidateQuery.isLoading;
    const error = ownerQuery.error || candidateQuery.error;

    const notifications: NotificationResponse[] = [
        ...(ownerQuery.data ?? []),
        ...(candidateQuery.data ?? []),
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
        console.error("Notifications error:", error);
        return (
            <SafeScreen backBtn title="Notifications">
                <Text>Erreur lors du chargement des notifications.</Text>
            </SafeScreen>
        );
    }

    /* ===================== ACTIONS ===================== */

    const onAccept = async (annonceId: string, candidate_id: string) => {
        console.log("onAccept", annonceId, candidate_id);

        if (!session) {
            Alert.alert("Connexion requise");
            return;
        }

        try {
            // 1️⃣ Accepter la candidature

            await acceptRequest({ candidate_id, annonce_id: annonceId });

            // 2️⃣ Décrémenter les places
            await supabase.rpc("decrement_places", { annonce: annonceId });

            // 3️⃣ Ajouter le candidat à la conversation
            await addUserConversation(candidate_id, annonceId);

            Alert.alert("Succès", "Candidature acceptée");
        } catch (e: any) {
            console.error("❌ ACCEPT ERROR:", e);
            Alert.alert("Erreur", JSON.stringify(e, null, 2));
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

            Alert.alert("Succès", "Candidature refusée");
        } catch (e: any) {
            Alert.alert("Erreur", e.message ?? "Impossible de refuser");
        }
    };

    /* ===================== RENDER ===================== */

    const renderItem = ({ item }: { item: NotificationResponse }) => {
        const isPending = item.status === StatusNotification.PENDING;
        console.log("render item", item);

        return (
            <View style={[styles.card, isPending && styles.cardHighlight]}>
                <Text style={styles.message}>{item.message}</Text>

                <Text style={styles.date}>
                    {new Date(item.created_at).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                    })}
                </Text>

                {isPending && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            // disabled={isPending}
                            style={[styles.actionBtn, styles.accept]}
                            onPress={() =>
                                onAccept(item.annonceId, item.userId)
                            }
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

/* ===================== STYLES ===================== */

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
