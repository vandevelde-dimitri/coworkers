import { useAnnouncementByFc } from "@/hooks/announcement/useAnnouncement";
import { containerStyles } from "@/styles/container.styles";
import { formAuthStyles } from "@/styles/form.styles";
import FeatherIcon from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    const { data, isLoading, error } = useAnnouncementByFc();

    if (isLoading) {
        return (
            <SafeAreaView
                style={[
                    formAuthStyles.container,
                    {
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    },
                ]}
            >
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        console.error("Error fetching announcements:", error);
        return (
            <SafeAreaView
                style={[
                    formAuthStyles.container,
                    {
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    },
                ]}
            >
                <Text>Error loading announcements</Text>
            </SafeAreaView>
        );
    }
    console.log("HomeScreen announcements:", data);
    return (
        <SafeAreaView
            style={[
                formAuthStyles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    // paddingLeft: insets.left,
                    // paddingRight: insets.right,
                },
            ]}
        >
            <View style={containerStyles.header}>
                <View style={containerStyles.headerBack}>
                    <FeatherIcon
                        color="#1D2A32"
                        name="chevron-left"
                        size={30}
                    />
                </View>
                <View style={containerStyles.headerTitle}>
                    <Text>Annonces pour votre centre</Text>
                </View>
            </View>
            <View style={containerStyles.container}>
                {data?.map(
                    ({
                        id,
                        title,
                        content,
                        number_of_places,
                        date_start,
                        date_end,
                    }) => (
                        <View style={styles.card} key={id}>
                            <View style={styles.header}>
                                <Text style={styles.title}>{title}</Text>
                                <View
                                    style={[
                                        styles.badge,
                                        {
                                            backgroundColor:
                                                number_of_places > 0
                                                    ? "#10B981"
                                                    : "#EF4444",
                                        },
                                    ]}
                                >
                                    <Text style={styles.badgeText}>
                                        {number_of_places > 0
                                            ? "Disponible"
                                            : "Complet"}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.content}>{content}</Text>

                            {date_start && (
                                <Text style={styles.dates}>
                                    Du {date_start} à{" "}
                                    {date_end ? `au ${date_end}` : "maintenant"}
                                </Text>
                            )}

                            <Text style={styles.places}>
                                {number_of_places} place(s) restantes
                            </Text>
                        </View>
                    )
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        flex: 1,
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 12,
    },
    content: {
        fontSize: 14,
        color: "#374151",
        marginBottom: 8,
    },
    dates: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 4,
    },
    places: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1D4ED8", // bleu Blablacar
    },
});
