import { useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar } from "../../components/ui/Avatar";
import { Card } from "../../components/ui/Card";
import { useAnnouncementByFc } from "../../hooks/announcement/useAnnouncement";

type SortBy = "date" | "seats" | "from";

export default function HomeScreen() {
    const { data: announcements, isLoading, error } = useAnnouncementByFc();
    const navigation = useNavigation();

    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortBy>("date");

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
        ({ item: ride }) => (
            <Card>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <Avatar uri={ride.user_avatar ?? ""} />
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
                    {ride.content}
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
                        onPress={() =>
                            navigation.navigate("HomeStack", {
                                screen: "AnnouncementDetail",
                                params: { id: ride.id },
                            })
                        }
                    >
                        <Text
                            style={{
                                color: "#2563eb",
                                fontWeight: "600",
                            }}
                        >
                            Voir détails
                        </Text>
                    </TouchableOpacity>
                </View>
            </Card>
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
        <FlatList
            data={rides}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "700",
                            marginBottom: 16,
                        }}
                    >
                        Coworkers
                    </Text>

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
                                onPress={() =>
                                    setSortBy(option.value as SortBy)
                                }
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
            }
        />
    );
}
