import { Notification } from "@/src/domain/entities/notification/Notification";
import { UserContract } from "@/src/domain/entities/user/User.enum";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Avatar from "../../components/ui/Avatar";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import ConversationItemSkeleton from "../../components/ui/skeleton/ConversationItemSkeleton";
import { useNotificationStatus } from "../../hooks/context/notificationContext";
import { useAcceptCandidate } from "../../hooks/mutations/useAcceptCandidate";
import { useRejectCandidate } from "../../hooks/mutations/useRejectCandidate";
import { useNotifications } from "../../hooks/queries/useNotifications";
import { useProtectedNavigation } from "../../hooks/useProtectedNavigation";

export default function NotificationsScreen() {
  const { setNotificationCount } = useNotificationStatus();
  const { mutateAsync: acceptCandidate, isPending } = useAcceptCandidate();
  const { mutateAsync: rejectCandidate, isPending: isRejecting } =
    useRejectCandidate();
  const { navigateSafely } = useProtectedNavigation();

  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useNotifications();
  const [selectedRequest, setSelectedRequest] = useState<Notification | null>(
    null,
  );

  useEffect(() => {
    setNotificationCount(0);
  }, []);

  const handleAccept = async (annonceId: string, userId: string) => {
    try {
      await acceptCandidate({
        candidateId: userId,
        annonceId: annonceId,
      });
    } catch (e) {
      if (__DEV__) console.error("Erreur lors de l'acceptation du candidat", e);
    }
  };

  const handleReject = async (annonceId: string, userId: string) => {
    try {
      await rejectCandidate({
        candidateId: userId,
        annonceId: annonceId,
      });
    } catch (e) {
      if (__DEV__) console.error("Erreur lors du refus du candidat", e);
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const isOwnerAction = item.scope === "owner" && item.status === "pending";

    return (
      <View style={styles.glassCard}>
        <View style={styles.cardHeader}>
          <Avatar
            size={48}
            userData={{
              profileAvatar: item.profileAvatar,
              avatarUpdatedAt: item.avatarUpdatedAt,
              contract: UserContract.CDD,
              id: item.otherUserId,
            }}
          />

          <View style={styles.headerContent}>
            <View style={styles.topLine}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.timeAgo}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <Text style={styles.messageText} numberOfLines={2}>
              {item.message}
            </Text>
          </View>
        </View>

        {isOwnerAction ? (
          <View style={styles.actionContainer}>
            <View style={styles.divider} />
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.baseActionBtn, styles.rejectBtn]}
                onPress={() => setSelectedRequest(item)}
              >
                <Ionicons name="close" size={20} color="#FF3B30" />
                <Text style={styles.rejectText}>Refuser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.baseActionBtn, styles.acceptBtn]}
                onPress={() => handleAccept(item.annonceId, item.otherUserId)}
              >
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.acceptText}>Accepter</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoFooter}>
            <View style={styles.infoBadge}>
              <Ionicons
                name={
                  item.status === "accepted" ? "sparkles" : "information-circle"
                }
                size={14}
                color="rgba(255,255,255,0.6)"
              />
              <Text style={styles.infoBadgeText}>
                {item.status === "accepted" ? "Accepté" : "Info"}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper showBackButton title="Notifications">
      {isLoading ? (
        <View style={styles.listContainer}>
          {[1, 2, 3].map((i) => (
            <ConversationItemSkeleton key={i} />
          ))}
        </View>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onRefresh={refetch}
          refreshing={isLoading}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <EmptyState
              icon="notifications-outline"
              description="Aucune notification de disponible"
              title="Aucune notification"
              onPress={() => navigateSafely("/(tabs)/formAnnouncement")}
              buttonLabel="Crée une annonce"
            />
          }
        />
      )}

      <ConfirmDialog
        visible={!!selectedRequest}
        title="Refuser le candidat ?"
        description={`Voulez-vous vraiment refuser la demande de ${selectedRequest?.userName} ?`}
        onConfirm={() => {
          if (selectedRequest) {
            handleReject(
              selectedRequest.annonceId,
              selectedRequest.otherUserId,
            );
            setSelectedRequest(null);
          }
        }}
        onCancel={() => setSelectedRequest(null)}
        danger
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContainer: { padding: 16, paddingBottom: 40 },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  headerContent: { flex: 1, marginLeft: 12 },
  topLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  timeAgo: { fontSize: 12, color: "rgba(255, 255, 255, 0.4)" },
  messageText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 16,
    marginBottom: 12,
  },
  actionContainer: { marginTop: 0 },
  buttonGroup: { flexDirection: "row", gap: 10 },
  baseActionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  acceptBtn: { backgroundColor: "#34C759" },
  rejectBtn: {
    backgroundColor: "rgba(255, 59, 48, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  acceptText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  rejectText: { color: "#FF3B30", fontWeight: "700", fontSize: 14 },
  infoFooter: { marginTop: 12, flexDirection: "row" },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoBadgeText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
