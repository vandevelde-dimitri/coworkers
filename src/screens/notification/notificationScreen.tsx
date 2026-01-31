import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { showToast } from "../../../utils/showToast";
import { supabase } from "../../../utils/supabase";
import SafeScreen from "../../components/SafeScreen";
import ConfirmModal from "../../components/ui/ConfirmModal";
import ScreenWrapper from "../../components/ui/CustomHeader";
import EmptyState from "../../components/ui/EmptyComponent";
import SmartImage from "../../components/ui/SmartImage";
import { useAcceptRequest } from "../../hooks/candidate/useCandidate";
import {
    useCandidateNotifications,
    useOwnerNotifications,
} from "../../hooks/notification/useNotification";
import { StatusNotification } from "../../types/enum/statusNotification.enum";
import { NotificationResponse } from "../../types/notification.interface";

export default function NotificationsScreen() {
    const ownerQuery = useOwnerNotifications();
    const [open, setOpen] = useState(false);
    const candidateQuery = useCandidateNotifications();
    const { mutateAsync: acceptRequest, isPending } = useAcceptRequest();

    const isLoading = ownerQuery.isLoading || candidateQuery.isLoading;
    const error = ownerQuery.error || candidateQuery.error;

    const notifications = [
        ...(ownerQuery.data ?? []).map((n) => ({ ...n, _scope: "owner" })),
        ...(candidateQuery.data ?? []).map((n) => ({
            ...n,
            _scope: "candidate",
        })),
    ].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    if (isLoading) {
        return (
            <SafeScreen backBtn title="Notifications">
                <Text>Chargement des notifications...</Text>
            </SafeScreen>
        );
    }

    if (error) {
        if (__DEV__) console.error("Notifications error:", error);
        return (
            <SafeScreen backBtn title="Notifications">
                <Text>Erreur lors du chargement des notifications.</Text>
            </SafeScreen>
        );
    }

    const onAccept = async (annonceId: string, candidate_id: string) => {
        try {
            await acceptRequest({ candidate_id, annonce_id: annonceId });
            showToast("success", "Candidature acceptée");
        } catch (e: any) {
            showToast("error", "Impossible d'accepter la candidature");
        }
    };

    const onReject = async (annonceId: string) => {
        try {
            const { error } = await supabase
                .from("participant_requests")
                .update({ status: "refused" })
                .eq("annonce_id", annonceId);

            if (error) throw error;

            showToast("success", "Candidature refusée");
        } catch (e: any) {
            showToast("error", "Impossible de refuser la candidature");
        }
    };

    const renderItem = ({ item }: { item: NotificationResponse }) => {
        const isPending = item.status === StatusNotification.PENDING;

        return (
            <View style={styles.card}>
                {/* Header notif */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <SmartImage size={44} userData={item} />

                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.name}>
                            {item.candidate_firstname} {item.candidate_lastname}
                        </Text>
                    </View>

                    {isPending ? (
                        <View style={styles.badgePending}>
                            <Text style={styles.badgeText}>Demande</Text>
                        </View>
                    ) : (
                        <View style={styles.badgePending}>
                            <Text style={styles.badgeText}>Information</Text>
                        </View>
                    )}
                </View>

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
                            style={[styles.actionBtn, styles.accept]}
                            onPress={() =>
                                onAccept(item.annonceId, item.userId)
                            }
                        >
                            <Text style={styles.actionText}>Accepter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, styles.reject]}
                            onPress={() => setOpen(true)}
                        >
                            <Text style={styles.actionText}>Refuser</Text>
                        </TouchableOpacity>
                        <ConfirmModal
                            visible={open}
                            title="Voulez-vous vraiment refuser ce candidat ?"
                            description="Cette action est irréversible."
                            confirmLabel="Oui"
                            cancelLabel="Non"
                            onCancel={() => setOpen(false)}
                            onConfirm={() => {
                                setOpen(false);
                                onReject(item.annonceId);
                                showToast("success", "Candidature refusée");
                            }}
                            danger
                        />
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScreenWrapper back title="Notifications">
            <FlatList
                data={notifications}
                keyExtractor={(item) => `${item.id}-${item._scope}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 32,
                    flexGrow: 1,
                    justifyContent:
                        notifications.length === 0 ? "center" : "flex-start",
                }}
                ListEmptyComponent={
                    <EmptyState
                        title="Aucune notification"
                        description="Vous serez averti ici des nouvelles candidatures et réponses."
                    />
                }
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    name: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
    },
    title: {
        fontSize: 13,
        color: "#6b7280",
    },
    message: {
        marginTop: 12,
        fontSize: 15,
        color: "#111827",
    },
    date: {
        marginTop: 6,
        fontSize: 12,
        color: "#9ca3af",
    },
    badgePending: {
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#92400E",
    },
    actions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 16,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
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
        fontWeight: "700",
    },
});
