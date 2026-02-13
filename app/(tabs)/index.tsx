import AnnouncementCardListItem from "@/src/presentation/components/ui/AnnouncementCardListItem";
import { Pagination } from "@/src/presentation/components/ui/molecules/pagination/Pagination";
import { SearchBar } from "@/src/presentation/components/ui/molecules/search-bar/SearchBar";
import AnnouncementSkeleton from "@/src/presentation/components/ui/skeleton/AnnouncementSkeleton";
import { useAnnouncements } from "@/src/presentation/hooks/queries/useAnnouncement";
import { useDebounce } from "@/src/presentation/hooks/useDebounce";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PAGE_SIZE = 5;
const FILTER_OPTIONS = [
    { id: "recent", label: "Plus récent", icon: "time-outline" },
    { id: "places", label: "Places", icon: "people-outline" },
    {
        id: "near",
        label: "Près de moi",
        icon: "location-outline",
        disabled: true,
    },
];

export default function HomeScreen() {
    const router = useRouter();
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("recent");
    const debouncedSearch = useDebounce(search, 300);
    const sortBy = activeFilter === "near" ? "recent" : activeFilter;

    const {
        data: { announcements, totalCount } = {
            announcements: [],
            totalCount: 0,
        },
        isLoading,
    } = useAnnouncements(page, PAGE_SIZE, debouncedSearch, sortBy, null); // TODO: Passer le fcId de l'utilisateur connecté

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Text style={styles.mainTitle}>Annonces disponibles</Text>

                <SearchBar
                    placeholder="Rechercher..."
                    containerWidth={350}
                    tint="#141E30"
                    centerWhenUnfocused={false}
                    onSearch={(text) => {
                        setSearch(text);
                        setPage(1);
                    }}
                />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterList}
                    contentContainerStyle={styles.filterListContent}
                >
                    {FILTER_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            disabled={option.disabled}
                            onPress={() => {
                                if (!option.disabled) {
                                    setActiveFilter(option.id);
                                    setPage(1);
                                }
                            }}
                            style={[
                                styles.filterBtn,
                                option.disabled && styles.filterBtnDisabled,
                                activeFilter === option.id &&
                                    !option.disabled &&
                                    styles.filterBtnActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    option.disabled &&
                                        styles.filterTextDisabled,
                                    activeFilter === option.id &&
                                        !option.disabled &&
                                        styles.filterTextActive,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {isLoading ? (
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <AnnouncementSkeleton />
                    <AnnouncementSkeleton />
                </View>
            ) : (
                <>
                    <FlatList
                        data={announcements}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <AnnouncementCardListItem item={item} />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponentStyle={{
                            paddingHorizontal: 20,
                            paddingBottom: 30,
                            paddingTop: 10,
                            alignItems: "flex-end",
                        }}
                        ListFooterComponent={
                            totalPages > 1 ? (
                                <Pagination
                                    activeIndex={page - 1}
                                    totalItems={totalPages}
                                    onIndexChange={(i) => setPage(i + 1)}
                                    dotSize={10}
                                />
                            ) : null
                        }
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: "#FFF",
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1A1A1A",
        textAlign: "center",
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F3F5",
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },

    listContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 130,
    },
    filterList: {
        marginTop: 20,
        marginBottom: 5,
    },
    filterListContent: {
        paddingRight: 40, // Pour éviter que le dernier bouton colle au bord
    },
    filterBtn: {
        backgroundColor: "#FFFFFF", // Fond blanc par défaut
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25, // Forme pilule
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#E9ECEF",
        // Petite ombre pour la profondeur
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    filterBtnActive: {
        backgroundColor: "#141E30", // Slate (Ardoise)
        borderColor: "#141E30",
    },
    filterBtnDisabled: {
        opacity: 0.45,
    },
    filterText: {
        fontWeight: "600",
        color: "#6C757D", // Gris moyen
        fontSize: 14,
    },
    filterTextActive: {
        color: "#FFFFFF", // Blanc sur fond sombre
    },
    filterTextDisabled: {
        color: "#ADB5BD",
    },
});
