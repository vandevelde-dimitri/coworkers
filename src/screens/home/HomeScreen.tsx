import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import AnnouncementCardList from "../../components/AnnouncementCardList";
import ScreenWrapper from "../../components/ui/CustomHeader";
import EmptyState from "../../components/ui/EmptyComponent";
import { IconButtonSelect } from "../../components/ui/InputButtonSelect";
import Pagination from "../../components/ui/Pagination";
import { useAuth } from "../../contexts/authContext";
import { useAnnouncementByFc } from "../../hooks/announcement/useAnnouncement";
import { useFloorsAll } from "../../hooks/useFloor";
import { useCurrentUser } from "../../hooks/user/useUsers";
import { AnnouncementWithUser } from "../../types/announcement.interface";

type SortBy = "date" | "seats" | "from";
const PAGE_SIZE = 5;

export default function HomeScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { session } = useAuth();
    const { data: currentUser } = useCurrentUser();
    const { data: floors } = useFloorsAll();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortBy>("date");
    const [selectedCenter, setSelectedCenter] = useState<string>("all");

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ["announcements"] });

        if (session && currentUser?.fc_id) {
            setSelectedCenter(currentUser.fc_id);
        } else if (!session) {
            setSelectedCenter("all");
        }
    }, [session, currentUser?.fc_id, queryClient]);

    const { data, isLoading, error, refetch } = useAnnouncementByFc(
        page,
        PAGE_SIZE,
        selectedCenter,
    );

    const isFirstRender = useRef(true);
    useFocusEffect(
        useCallback(() => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            refetch();
        }, [refetch]),
    );

    const announcements = data?.data || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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

    const sortOptions = [
        { label: "Plus récent", value: "date" },
        { label: "Places", value: "seats" },
        { label: "Près de moi", value: "from" },
    ];

    const rides = useMemo(() => {
        if (!announcements) return [];
        let filteredData = [...announcements];

        if (search.trim()) {
            const q = search.toLowerCase();
            filteredData = filteredData.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.content.toLowerCase().includes(q) ||
                    a.city.toLowerCase().includes(q),
            );
        }

        switch (sortBy) {
            case "date":
                filteredData.sort(
                    (a, b) =>
                        new Date(b.date_start).getTime() -
                        new Date(a.date_start).getTime(),
                );
                break;
            case "seats":
                filteredData.sort(
                    (a, b) => b.number_of_places - a.number_of_places,
                );
                break;
            case "from":
                filteredData.sort((a, b) => a.city.localeCompare(b.city));
                break;
        }
        return filteredData;
    }, [announcements, search, sortBy]);

    const renderItem = useCallback(
        ({ item }: { item: AnnouncementWithUser }) => (
            <AnnouncementCardList data={item} key={item.id} />
        ),
        [],
    );

    if (isLoading)
        return (
            <ScreenWrapper title="Chargement...">
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text>Chargement des annonces...</Text>
                </View>
            </ScreenWrapper>
        );
    if (error)
        return (
            <ScreenWrapper title="Erreur">
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text>Erreur lors du chargement</Text>
                </View>
            </ScreenWrapper>
        );

    return (
        <ScreenWrapper
            title={
                selectedCenterLabel
                    ? `Annonces pour ${selectedCenterLabel}`
                    : "Annonces disponibles"
            }
        >
            <View>
                {/* Barre de recherche */}
                <TextInput
                    placeholder="Rechercher une ville, un titre..."
                    value={search}
                    onChangeText={setSearch}
                    style={{
                        backgroundColor: "#f3f4f6",
                        borderRadius: 16,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        fontSize: 15,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                    }}
                />

                {/* Filtres et Bouton Select */}
                <View
                    style={{
                        flexDirection: "row",
                        marginBottom: 16,
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    {sortOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => setSortBy(option.value as SortBy)}
                            style={{
                                backgroundColor:
                                    sortBy === option.value
                                        ? "#2563eb"
                                        : "#e5e7eb",
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 12,
                                marginRight: 8,
                                marginBottom: 8,
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        sortBy === option.value
                                            ? "#fff"
                                            : "#374151",
                                    fontWeight: "600",
                                }}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <IconButtonSelect
                        options={centersOptions}
                        selectedValue={selectedCenter}
                        onSelect={(val) => {
                            setSelectedCenter(val);
                            setPage(1);
                        }}
                    />
                </View>
            </View>

            <FlatList
                data={rides}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 20,
                    justifyContent:
                        rides.length === 0 ? "center" : "flex-start",
                }}
                ListEmptyComponent={
                    <EmptyState
                        title="Aucune annonce"
                        description="Essayez de changer de centre ou de critères de recherche."
                        actionLabel="Créer une annonce"
                        onAction={() =>
                            (navigation as any).navigate("FormStack", {
                                screen: "FormAnnouncementScreen",
                            })
                        }
                    />
                }
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    totalPages > 1 ? (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    ) : null
                }
            />
        </ScreenWrapper>
    );
}
