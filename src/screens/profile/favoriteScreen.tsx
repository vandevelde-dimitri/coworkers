import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import AnnouncementCardList from "../../components/AnnouncementCardList";
import SafeScreen from "../../components/SafeScreen";
import { useAnnouncementsFavorites } from "../../hooks/announcement/useAnnouncement";
const FavoriteScreen = () => {
    // Simulated data fetching
    const { data: announcements, isLoading } = useAnnouncementsFavorites();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    console.log("annonce en favori", announcements);

    return (
        <SafeScreen backBtn title="Mes favoris">
            <View style={{ flex: 1 }}>
                {!announcements || announcements.length === 0 ? (
                    <Text>Aucune annonce en favoris.</Text>
                ) : (
                    <FlatList
                        data={announcements}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item, index }) => (
                            <AnnouncementCardList data={item} index={index} />
                        )}
                        contentContainerStyle={{
                            padding: 16,
                            paddingBottom: 40,
                        }}
                    />
                )}
            </View>
        </SafeScreen>
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
});
