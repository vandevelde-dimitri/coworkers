import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import AnnouncementCardList from "../../components/AnnouncementCardList";
import ScreenWrapper from "../../components/ui/CustomHeader";
import EmptyState from "../../components/ui/EmptyComponent";
import Pagination from "../../components/ui/Pagination";
import { useAnnouncementsFavorites } from "../../hooks/announcement/useAnnouncement";

const PAGE_SIZE = 5;
const FavoriteScreen = () => {
    // Simulated data fetching
    const [page, setPage] = useState(1);

    const { data, isLoading } = useAnnouncementsFavorites(page, PAGE_SIZE);
    const navigation = useNavigation();
    const favorites = data?.data || [];
    const totalPages = Math.ceil((data?.totalCount || 0) / PAGE_SIZE);
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

   

    return (
        <ScreenWrapper back title="Mes favoris">
            <View style={{ flex: 1 }}>
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent:
                            favorites?.length === 0 ? "center" : "flex-start",
                    }}
                    ListEmptyComponent={
                        <EmptyState
                            title="Aucun favori"
                            description="Ajoutez des annonces en favori pour les retrouver rapidement."
                            actionLabel="Explorer les annonces"
                            onAction={() =>
                                (navigation as any).navigate("HomeStack", {
                                    screen: "HomeScreen",
                                })
                            }
                        />
                    }
                    renderItem={({ item }) => (
                        <AnnouncementCardList data={item} key={item.id} />
                    )}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    }
                />
            </View>
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
});
