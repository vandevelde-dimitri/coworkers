import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import AnnouncementCardListItem from "../../components/ui/AnnouncementCardListItem";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import AnnouncementCardSkeleton from "../../components/ui/skeleton/AnnouncementSkeleton";
import { useUserFavoriteAnnouncements } from "../../hooks/queries/useUserFavoriteAnnouncements";
import { useProtectedNavigation } from "../../hooks/useProtectedNavigation";

const FavoriteScreen = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useUserFavoriteAnnouncements();
  const { navigateSafely } = useProtectedNavigation();

  const announcements = data?.announcements || [];

  return (
    <ScreenWrapper showBackButton title="Mes favoris">
      {isLoading ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <AnnouncementCardSkeleton />
          <AnnouncementCardSkeleton />
        </View>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AnnouncementCardListItem
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="heart-outline"
              description="Veuillez mettre en favori une annonce"
              title="Aucune favoris"
              onPress={() => navigateSafely("/(tabs)/home")}
              buttonLabel="Trouver une annonce"
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    height: 44,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  buttonActive: { backgroundColor: "#10B981" },
  buttonText: { fontSize: 14, color: "#111827", fontWeight: "500" },
  buttonTextActive: { color: "#fff" },
  emptyContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyText: { fontSize: 16, marginBottom: 12 },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 150,
  },
});
