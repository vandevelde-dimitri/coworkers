import SafeScreen from "@/components/SafeScreen";
import { useAnnouncementByFc } from "@/hooks/announcement/useAnnouncement";
import { containerStyles } from "@/styles/container.styles";
import { formAuthStyles } from "@/styles/form.styles";
import { Contract } from "@/types/enum/contract.enum";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

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
        <SafeScreen title="Annonces pour votre centre" backBtn={false}>
            <View style={containerStyles.container}>
                {data?.map(
                    ({
                        id,
                        title,
                        content,
                        number_of_places,
                        date_start,
                        date_end,
                        user_name,
                        contract,
                        image_profile,
                        team,
                    }) => (
                        <TouchableOpacity
                            style={styles.card}
                            key={id}
                            onPress={() => {
                                router.push(
                                    `/(tabs)/(home)/announcement/${id}`
                                );
                            }}
                        >
                            {/* 🔹 Header avec avatar et utilisateur */}
                            <View style={styles.header}>
                                <Image
                                    alt="Avatar"
                                    source={{
                                        uri: image_profile
                                            ? image_profile
                                            : "https://ui-avatars.com/api/?name=" +
                                              user_name,
                                    }}
                                    style={[
                                        styles.profileAvatar,
                                        contract === Contract.CDI
                                            ? { borderColor: "#1D4ED8" }
                                            : contract === Contract.CDD
                                            ? { borderColor: "#10B981" }
                                            : { borderColor: "#6B7280" },
                                    ]}
                                />
                                <View style={{ marginLeft: 8 }}>
                                    <Text style={styles.userName}>
                                        {user_name}
                                    </Text>
                                    <Text style={styles.fcName}>{team}</Text>
                                </View>
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
                            <View style={styles.body}>
                                <Text style={styles.title}>{title}</Text>
                                <Text style={styles.content}>{content}</Text>
                            </View>
                            <Text style={styles.places}>
                                {number_of_places} place(s) restante(s)
                            </Text>
                            {date_start && (
                                <Text style={styles.dates}>
                                    Du {date_start}{" "}
                                    {date_end
                                        ? `au ${date_end}`
                                        : "(valable sans limite)"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    )
                )}
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    profileAvatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        borderWidth: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
    },
    fcName: {
        fontSize: 12,
        color: "#6B7280",
    },
    badge: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    body: {
        marginTop: 6,
    },
    title: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 4,
    },
    content: {
        fontSize: 14,
        color: "#4B5563",
    },
    places: {
        marginTop: 8,
        fontWeight: "500",
        color: "#111827",
    },
    dates: {
        marginTop: 4,
        fontSize: 13,
        color: "#6B7280",
    },
});
