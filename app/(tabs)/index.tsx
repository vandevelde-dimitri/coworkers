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

export default function HomeScreen() {
    const router = useRouter();
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const {
        data: { announcements, totalCount } = {
            announcements: [],
            totalCount: 0,
        },
        isLoading,
    } = useAnnouncements(page, PAGE_SIZE, debouncedSearch, null); // TODO: Passer le fcId de l'utilisateur connecté

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
                >
                    <TouchableOpacity
                        style={[styles.filterBtn, styles.filterBtnActive]}
                    >
                        <Text style={styles.filterTextActive}>Plus récent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Text style={styles.filterText}>Places</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Text style={styles.filterText}>Près de moi</Text>
                    </TouchableOpacity>
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
    filterList: { marginTop: 15 },
    filterBtn: {
        backgroundColor: "#E9ECEF",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 10,
    },
    filterBtnActive: { backgroundColor: "#228BE6" },
    filterText: { fontWeight: "600", color: "#495057" },
    filterTextActive: { color: "#FFF", fontWeight: "600" },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 130,
    },
});
