import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar } from "../../components/ui/Avatar";
import { Card } from "../../components/ui/Card";
import { useAnnouncementByFc } from "../../hooks/announcement/useAnnouncement";

export default function HomeScreen() {
    const { data: announcements, isLoading, error } = useAnnouncementByFc();
    const [sortBy, setSortBy] = useState("date");
    const navigation = useNavigation();

    const [search, setSearch] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState<"recent" | "places">("recent");

    const filtered = useMemo(() => {
        if (!announcements) return [];

        let data = [...announcements];

        if (search) {
            data = data.filter(
                (a) =>
                    a.title.toLowerCase().includes(search.toLowerCase()) ||
                    a.content.toLowerCase().includes(search.toLowerCase()) ||
                    a.city.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (availableOnly) data = data.filter((a) => a.number_of_places > 0);

        if (sortOrder === "recent") {
            data.sort((a, b) => (a.date_start < b.date_start ? 1 : -1));
        } else if (sortOrder === "places") {
            data.sort((a, b) => b.number_of_places - a.number_of_places);
        }

        return data;
    }, [search, availableOnly, sortOrder, announcements]);

    // Tri selon sortBy
    const sortedRides = [...filtered].sort((a, b) => {
        if (sortBy === "date") return new Date(a.date) - new Date(b.date);
        if (sortBy === "seats") return b.number_of_places - a.number_of_places;
        if (sortBy === "from") return a.city.localeCompare(b.city);
        return 0;
    });
    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        console.error("Error fetching announcements:", error);
        return (
            <View>
                <Text>Error loading announcements</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
                Coworkers
            </Text>

            {/* Input de recherche */}
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

            {/* Boutons de tri */}
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
                    // { label: "Popularité", value: "popularity" },
                    { label: "Près de moi", value: "from" },
                ].map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => setSortBy(option.value)}
                        style={{
                            backgroundColor:
                                sortBy === option.value ? "#2563eb" : "#e5e7eb",
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

            {sortedRides.map((ride) => (
                <Card key={ride.id}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 8,
                        }}
                    >
                        <Avatar uri={""} />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={{ fontWeight: "600" }}>
                                {ride.user_name}
                            </Text>
                            <Text style={{ fontSize: 12, color: "#6b7280" }}>
                                {new Date(ride.date_start).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: "700" }}>
                        {ride.title}
                    </Text>
                    <Text style={{ marginTop: 4, color: "#374151" }}>
                        {"ride.from"} → {"ride.to"}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 12,
                        }}
                    >
                        <Text>Places: {ride.number_of_places}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("HomeStack", {
                                    screen: "AnnouncementDetail",
                                    params: { id: sortedRides.id },
                                });
                            }}
                        >
                            <Text
                                style={{ color: "#2563eb", fontWeight: "600" }}
                            >
                                Voir détails
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            ))}
            {/* Pagination avec flèches */}
            {/* <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 12,
                    marginBottom: 24,
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                    style={{
                        padding: 10,
                        margin: 4,
                        borderRadius: 12,
                        backgroundColor: "#e5e7eb",
                    }}
                >
                    <Text style={{ fontWeight: "600" }}>{"<"}</Text>
                </TouchableOpacity>
                {Array.from({ length: totalPages }, (_, i) => (
                    <TouchableOpacity
                        key={i + 1}
                        onPress={() => setPage(i + 1)}
                        style={{
                            padding: 10,
                            margin: 4,
                            borderRadius: 12,
                            backgroundColor:
                                page === i + 1 ? "#2563eb" : "#e5e7eb",
                        }}
                    >
                        <Text
                            style={{
                                color: page === i + 1 ? "#fff" : "#374151",
                                fontWeight: "600",
                            }}
                        >
                            {i + 1}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    onPress={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    style={{
                        padding: 10,
                        margin: 4,
                        borderRadius: 12,
                        backgroundColor: "#e5e7eb",
                    }}
                >
                    <Text style={{ fontWeight: "600" }}>{">"}</Text>
                </TouchableOpacity>
            </View> */}
        </ScrollView>
    );
}

//
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: "#fff",
//     },
//     loadingContainer: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     searchInput: {
//         height: 44,
//         backgroundColor: "#f3f4f6",
//         borderRadius: 12,
//         paddingHorizontal: 12,
//         fontSize: 16,
//         marginBottom: 12,
//     },
//     buttonsRow: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         gap: 8,
//         marginBottom: 12,
//     },
//     button: {
//         paddingVertical: 10,
//         paddingHorizontal: 14,
//         borderRadius: 12,
//         backgroundColor: "#f3f4f6",
//     },
//     buttonActive: { backgroundColor: "#10B981" },
//     buttonText: { fontSize: 14, color: "#111827", fontWeight: "500" },
//     buttonTextActive: { color: "#fff" },
// });
