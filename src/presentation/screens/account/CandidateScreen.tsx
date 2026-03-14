import { CandidateAnnouncement } from "@/src/domain/entities/announcement/Announcement";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ComponentProps } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ApplyButton from "../../components/ui/ApplyButton";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import CandidateItemSkeleton from "../../components/ui/skeleton/CandidateItemSkeleton";
import { useUserApplications } from "../../hooks/queries/useUserApplication";
import { useProtectedNavigation } from "../../hooks/useProtectedNavigation";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export default function CandidateScreen() {
  const router = useRouter();
  const {
    data: applications,
    isLoading,
    isError,
    refetch,
  } = useUserApplications();
  const { navigateSafely } = useProtectedNavigation();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          color: "#34C759",
          bg: "rgba(52, 199, 89, 0.1)",
          icon: "checkmark-circle",
        };
      case "refused":
        return {
          color: "#FF3B30",
          bg: "rgba(255, 59, 48, 0.1)",
          icon: "close-circle",
        };
      default:
        return { color: "#FF9500", bg: "rgba(255, 149, 0, 0.1)", icon: "time" };
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper title="Mes candidatures" showBackButton>
        <View style={{ padding: 20 }}>
          {[1, 2, 3].map((i) => (
            <CandidateItemSkeleton key={i} />
          ))}
        </View>
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper title="Mes candidatures" showBackButton>
        <ErrorState onRetry={refetch} />
      </ScreenWrapper>
    );
  }

  const renderItem = ({ item }: { item: CandidateAnnouncement }) => {
    const statusConfig = getStatusStyle(item.status);

    return (
      <View style={styles.glassCard}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.annonces.title}
            </Text>
            <Text style={styles.date}>
              Postulé le {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
          >
            <Ionicons
              name={statusConfig.icon as IoniconName}
              size={14}
              color={statusConfig.color}
            />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {item.status === "pending"
                ? "En attente"
                : item.status === "accepted"
                  ? "Accepté"
                  : "Refusé"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/home/[id]",
                params: { id: item.annonces.id },
              })
            }
          >
            <Text style={styles.detailsButtonText}>Voir l'annonce</Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color="rgba(255,255,255,0.7)"
            />
          </TouchableOpacity>

          <View style={styles.mainAction}>
            <ApplyButton
              annonce={{
                ...item.annonces,
                conversation_id: item.conversation_id,
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper showBackButton title="Mes candidatures">
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            description="Veuillez participer à une annonce"
            title="Aucune candidature"
            onPress={() => navigateSafely("/(tabs)/home")}
            buttonLabel="Trouver une annonce"
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 16,
  },
  actionContainer: {
    marginTop: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  actionButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 16,
    gap: 4,
  },
  detailsButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    fontSize: 13,
  },
  mainAction: {
    flex: 1,
  },
});
