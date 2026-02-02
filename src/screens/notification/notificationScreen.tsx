import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { showToast } from "../../../utils/showToast";
import { supabase } from "../../../utils/supabase";
import ConfirmModal from "../../components/ui/ConfirmModal";
import ScreenWrapper from "../../components/ui/CustomHeader";
import EmptyState from "../../components/ui/EmptyComponent";
import SmartImage from "../../components/ui/SmartImage";
import { useNotificationStatus } from "../../contexts/notificationContext";
import { useAcceptRequest } from "../../hooks/candidate/useCandidate";
import {
    useCandidateNotifications,
    useOwnerNotifications,
} from "../../hooks/notification/useNotification";

export default function NotificationsScreen() {
    const { setHasNewNotification } = useNotificationStatus();
    const [selectedRequest, setSelectedRequest] = useState<{
        id: string;
        annonceId: string;
    } | null>(null);

    const ownerQuery = useOwnerNotifications();
    const candidateQuery = useCandidateNotifications();
    const { mutateAsync: acceptRequest } = useAcceptRequest();

    // On marque comme lu dès l'entrée sur l'écran
    useEffect(() => {
        setHasNewNotification(false);
    }, []);

    console.log("notification", ownerQuery);

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

    const handleAccept = async (annonceId: string, userId: string) => {
        try {
            await acceptRequest({
                candidate_id: userId,
                annonce_id: annonceId,
            });
            showToast("success", "Candidature acceptée !");
            ownerQuery.refetch();
        } catch (e) {
            showToast("error", "Erreur lors de l'acceptation");
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        try {
            const { error } = await supabase
                .from("participant_requests")
                .update({ status: "refused" })
                .eq("annonce_id", selectedRequest.annonceId)
                .eq("user_id", selectedRequest.id);

            if (error) throw error;
            showToast("success", "Candidature refusée");
            ownerQuery.refetch();
        } catch (e) {
            showToast("error", "Erreur lors du refus");
        } finally {
            setSelectedRequest(null);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isPending = item.status === "pending" && item._scope === "owner";

        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <SmartImage size={44} userData={item} />
                    <View style={styles.headerText}>
                        <Text style={styles.name}>
                            {item.candidate_firstname} {item.candidate_lastname}
                        </Text>
                        <Text style={styles.date}>
                            {new Date(item.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.badge,
                            {
                                backgroundColor: isPending
                                    ? "#FEF3C7"
                                    : "#E5E7EB",
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.badgeText,
                                { color: isPending ? "#92400E" : "#374151" },
                            ]}
                        >
                            {isPending ? "Demande" : "Info"}
                        </Text>
                    </View>
                </View>

                <Text style={styles.message}>{item.message}</Text>

                {isPending && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.btn, styles.acceptBtn]}
                            onPress={() =>
                                handleAccept(item.annonceId, item.user_id)
                            }
                        >
                            <Text style={styles.btnText}>Accepter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btn, styles.rejectBtn]}
                            onPress={() =>
                                setSelectedRequest({
                                    id: item.user_id,
                                    annonceId: item.annonceId,
                                })
                            }
                        >
                            <Text style={styles.btnText}>Refuser</Text>
                        </TouchableOpacity>
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
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <EmptyState
                        title="Rien pour le moment"
                        description="Vos notifications apparaîtront ici."
                    />
                }
            />

            <ConfirmModal
                visible={!!selectedRequest}
                title="Refuser le candidat ?"
                description="Cette action est définitive."
                onConfirm={handleReject}
                onCancel={() => setSelectedRequest(null)}
                danger
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    list: { padding: 16, flexGrow: 1 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
    },
    header: { flexDirection: "row", alignItems: "center" },
    headerText: { flex: 1, marginLeft: 12 },
    name: { fontWeight: "bold", fontSize: 16 },
    date: { fontSize: 12, color: "#9ca3af" },
    message: { marginTop: 10, color: "#4b5563" },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 10, fontWeight: "bold" },
    actions: { flexDirection: "row", marginTop: 15, gap: 10 },
    btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
    acceptBtn: { backgroundColor: "#10B981" },
    rejectBtn: { backgroundColor: "#EF4444" },
    btnText: { color: "#fff", fontWeight: "600" },
});
