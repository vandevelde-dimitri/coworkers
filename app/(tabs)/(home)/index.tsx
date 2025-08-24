import AnnouncementCardList from "@/components/AnnouncementCardList";
import SafeScreen from "@/components/SafeScreen";
import { useAnnouncementByFc } from "@/hooks/announcement/useAnnouncement";
import { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
    const { data: announcements, isLoading, error } = useAnnouncementByFc();
    const [search, setSearch] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState<"recent" | "places">("recent");

    const filtered = useMemo(() => {
        if (!announcements) return null;
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
    }, [search, availableOnly, sortOrder]);

    if (isLoading) {
        return (
            <SafeScreen>
                <Text>Loading...</Text>
            </SafeScreen>
        );
    }

    if (error) {
        console.error("Error fetching announcements:", error);
        return (
            <SafeScreen>
                <Text>Error loading announcements</Text>
            </SafeScreen>
        );
    }
    console.log("HomeScreen announcements:", announcements);
    return (
        <SafeScreen title="Annonces pour votre centre">
            <View>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher une annonce..."
                    value={search}
                    onChangeText={setSearch}
                />

                <View style={styles.buttonsRow}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            availableOnly && styles.buttonActive,
                        ]}
                        onPress={() => setAvailableOnly(!availableOnly)}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                availableOnly && styles.buttonTextActive,
                            ]}
                        >
                            Disponible
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            sortOrder === "recent" && styles.buttonActive,
                        ]}
                        onPress={() => setSortOrder("recent")}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                sortOrder === "recent" &&
                                    styles.buttonTextActive,
                            ]}
                        >
                            Plus récentes
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            sortOrder === "places" && styles.buttonActive,
                        ]}
                        onPress={() => setSortOrder("places")}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                sortOrder === "places" &&
                                    styles.buttonTextActive,
                            ]}
                        >
                            Plus de places
                        </Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <AnnouncementCardList
                            data={item}
                            key={index}
                            index={index}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    // container: { flex: 1, padding: 16 },
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
    teamRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12,
    },
    teamButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#f3f4f6",
    },
    teamButtonActive: { backgroundColor: "#1D4ED8" },
    teamText: { fontSize: 13, color: "#111827", fontWeight: "500" },
    teamTextActive: { color: "#fff" },
});
