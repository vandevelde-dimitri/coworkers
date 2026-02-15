import AnnouncementCardListItem from "@/src/presentation/components/ui/AnnouncementCardListItem";
import { IconButtonSelect } from "@/src/presentation/components/ui/IconButtonSelect";
import { Pagination } from "@/src/presentation/components/ui/molecules/pagination/Pagination";
import { SearchBar } from "@/src/presentation/components/ui/molecules/search-bar/SearchBar";
import AnnouncementSkeleton from "@/src/presentation/components/ui/skeleton/AnnouncementSkeleton";
import { useAuth } from "@/src/presentation/hooks/authContext";
import { useAnnouncements } from "@/src/presentation/hooks/queries/useAnnouncement";
import { useFloors } from "@/src/presentation/hooks/queries/useFloor";
import { useCurrentUser } from "@/src/presentation/hooks/queries/useUser";
import { useDebounce } from "@/src/presentation/hooks/useDebounce";
import { queryClient } from "@/utils/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { EmptyState } from "../../components/ui/EmptyState";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useProtectedNavigation } from "../../hooks/useProtectedNavigation";

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

export default function AnnouncementHomeScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const { data: currentUser } = useCurrentUser();

    const { navigateSafely } = useProtectedNavigation();
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [selectedCenter, setSelectedCenter] = useState<string>("all");
    const [activeFilter, setActiveFilter] = useState("recent");
    const debouncedSearch = useDebounce(search, 300);
    const sortBy = activeFilter === "near" ? "recent" : activeFilter;
    const { data: floors } = useFloors();

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });

        if (session && currentUser?.fcId) {
            setSelectedCenter(currentUser.fcId);
        } else if (!session) {
            setSelectedCenter("all");
        }
    }, [session, currentUser?.fcId, queryClient]);

    const {
        data: { announcements, totalCount } = {
            announcements: [],
            totalCount: 0,
        },
        isLoading,
    } = useAnnouncements(
        page,
        PAGE_SIZE,
        debouncedSearch,
        sortBy,
        selectedCenter,
    );

    const centersOptions = useMemo(() => {
        const options =
            floors?.map((c) => ({
                label: c.name,
                value: c.id,
            })) || [];
        return [{ label: "Tous les centres", value: "all" }, ...options];
    }, [floors]);

    const selectedCenterLabel = useMemo(() => {
        const center = centersOptions.find(
            (opt) => opt.value === selectedCenter,
        );
        return center?.value === "all" ? null : center?.label;
    }, [selectedCenter, centersOptions]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.mainTitle}>
                    {selectedCenterLabel
                        ? `Annonces pour ${selectedCenterLabel}`
                        : "Annonces disponibles"}
                </Text>

                <SearchBar
                    placeholder="Rechercher un trajet..."
                    tint="rgba(255,255,255,0.1)"
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
                    <IconButtonSelect
                        onSelect={(val) => {
                            setSelectedCenter(val);
                            setPage(1);
                        }}
                        options={centersOptions}
                        selectedValue={selectedCenter}
                    />
                </ScrollView>
            </View>

            {isLoading ? (
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <AnnouncementSkeleton />
                    <AnnouncementSkeleton />
                </View>
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
                            iconName="search-outline"
                            description="Aucune annonce ne correspond à votre recherche."
                            title="Aucune annonce"
                            onPress={() => navigateSafely("../add")}
                        />
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponentStyle={styles.footerPagination}
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
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#141E30",
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "left",
        marginBottom: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 150,
    },
    filterList: {
        marginTop: 20,
    },
    filterListContent: {
        paddingRight: 40,
        alignItems: "center",
        gap: 8,
    },
    filterBtn: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    filterBtnActive: {
        backgroundColor: "#FFFFFF",
        borderColor: "#FFFFFF",
    },
    filterBtnDisabled: {
        opacity: 0.2,
    },
    filterText: {
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 14,
    },
    filterTextActive: {
        color: "#141E30",
    },
    filterTextDisabled: {
        color: "#FFFFFF",
    },
    footerPagination: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
        alignItems: "center",
    },
});
