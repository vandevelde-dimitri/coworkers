import { useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
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
import Pagination from "../../components/ui/Pagination";
import { useAnnouncementByFc } from "../../hooks/announcement/useAnnouncement";
import { AnnouncementWithUser } from "../../types/announcement.interface";

type SortBy = "date" | "seats" | "from";
const PAGE_SIZE = 5;

export default function HomeScreen() {
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useAnnouncementByFc(page, PAGE_SIZE);
    const navigation = useNavigation();

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortBy>("date");

    // On extrait les données du nouvel objet de retour
    const announcements = data?.data || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const rides = useMemo(() => {
        if (!announcements) return [];

        let data = [...announcements];

        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.content.toLowerCase().includes(q) ||
                    a.city.toLowerCase().includes(q)
            );
        }

        switch (sortBy) {
            case "date":
                data.sort(
                    (a, b) =>
                        new Date(b.date_start).getTime() -
                        new Date(a.date_start).getTime()
                );
                break;
            case "seats":
                data.sort((a, b) => b.number_of_places - a.number_of_places);
                break;
            case "from":
                data.sort((a, b) => a.city.localeCompare(b.city));
                break;
        }

        return data;
    }, [announcements, search, sortBy]);

    const renderItem = useCallback(
        ({ item: announcements }: { item: AnnouncementWithUser }) => (
            <AnnouncementCardList data={announcements} key={announcements.id} />
        ),
        [navigation]
    );

    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View>
                <Text>Error loading announcements</Text>
            </View>
        );
    }

    return (
        <ScreenWrapper title="Annonce pour Lil1">
            <View>
                <TextInput
                    placeholder="Rechercher une annonce..."
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

                <View
                    style={{
                        flexDirection: "row",
                        marginBottom: 16,
                        flexWrap: "wrap",
                    }}
                >
                    {[
                        { label: "Plus récent", value: "date" },
                        { label: "Places", value: "seats" },
                        { label: "Près de moi", value: "from" },
                    ].map((option) => (
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
                </View>
            </View>
            <FlatList
                data={rides}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent:
                        rides.length === 0 ? "center" : "flex-start",
                }}
                ListEmptyComponent={
                    <EmptyState
                        title="Aucune annonce disponible"
                        description="Il n’y a pas encore d’annonce correspondant à votre centre ou à vos critères."
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
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                }
            />
        </ScreenWrapper>
    );
}
