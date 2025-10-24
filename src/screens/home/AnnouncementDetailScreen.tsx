import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { isMyAnnouncement } from "../../../utils/announcementUtils";
import { formatDate } from "../../../utils/formatedDate";
import { useAuth } from "../../contexts/authContext";
import {
    useAnnouncementById,
    useDeleteAnnouncement,
} from "../../hooks/announcement/useAnnouncement";
import { Contract } from "../../types/enum/contract.enum";

export default function AnnouncementDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();

    const { id } = route.params as { id: string };
    const { session } = useAuth();
    const {
        data: announcement,
        isLoading,
        error,
    } = useAnnouncementById(id as string);
    const { mutate: deleteAnnouncement } = useDeleteAnnouncement();

    if (!announcement) {
        return (
            <View>
                <Text>Announcement not found</Text>
            </View>
        );
    }

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

    const onApply = () => {
        console.log("Apply to announcement:", id);
        // Logique pour postuler à l'annonce
    };

    const onFavorite = () => {
        console.log("Add to favorites:", id);
        // Logique pour ajouter aux favoris
    };

    const onEdit = () => {
        console.log("Edit announcement:", id);
        // Logique pour modifier l'annonce
        if (!isOwner) return;
        navigation.navigate("FormStack", {
            screen: "FormAnnouncementScreen",
            params: { id },
        });
    };

    const onDelete = () => {
        console.log("Delete announcement:", id);
        if (!isOwner) return;
        deleteAnnouncement(id as string);
        navigation.popToTop();
    };

    const date_start_formated = formatDate(announcement.date_start);
    const date_end_formated = formatDate(announcement.date_end);
    const isOwner = isMyAnnouncement(announcement, session?.user.id);

    return (
        <View>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Card principale */}
                <View style={styles.card}>
                    <Text style={styles.title}>{announcement.title}</Text>

                    <View style={styles.userSection}>
                        <Image
                            source={{
                                uri:
                                    announcement.users.image_profile ||
                                    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=facearea&w=256&h=256&q=80",
                            }}
                            style={[
                                styles.avatar,
                                announcement.users.contract === Contract.CDI
                                    ? { borderColor: "#1D4ED8" }
                                    : { borderColor: "#10B981" },
                            ]}
                        />
                        <View style={{ marginLeft: 12 }}>
                            <Text style={styles.userName}>
                                {announcement.users.firstname}
                            </Text>
                            <Text style={styles.city}>
                                {announcement.users.city}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.contentText}>
                        {announcement.content}
                    </Text>

                    {announcement.date_start && (
                        <Text style={styles.dates}>
                            {`${
                                announcement.date_end
                                    ? `Du ${date_start_formated} au ${date_end_formated}`
                                    : `A partir du ${date_start_formated}`
                            }`}
                        </Text>
                    )}

                    <Text
                        style={[
                            styles.places,
                            announcement.number_of_places === 0 && {
                                color: "#ff0000",
                            },
                        ]}
                    >
                        {announcement.number_of_places} place
                        {announcement.number_of_places > 1 ? "s" : ""} dispo
                    </Text>

                    {/* Actions */}
                    <View style={styles.actions}>
                        {isOwner ? (
                            <>
                                <TouchableOpacity
                                    style={styles.buttonPrimary}
                                    onPress={onEdit}
                                >
                                    <Text style={styles.buttonPrimaryText}>
                                        Modifier
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.buttonSecondaryTrash}
                                    onPress={onDelete}
                                >
                                    <Text
                                        style={styles.buttonSecondaryTextTrash}
                                    >
                                        Supprimer
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={styles.buttonPrimary}
                                    onPress={onApply}
                                >
                                    <Text style={styles.buttonPrimaryText}>
                                        Postuler
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.buttonSecondary}
                                    onPress={onFavorite}
                                >
                                    <FeatherIcon
                                        name="heart"
                                        size={20}
                                        color="#10B981"
                                    />
                                    <Text style={styles.buttonSecondaryText}>
                                        Mettre en favoris
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
    },
    userSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
    },
    city: {
        fontSize: 13,
        color: "#999",
        marginTop: 2,
    },
    contentText: {
        fontSize: 15,
        color: "#333",
        marginBottom: 8,
    },
    dates: {
        fontSize: 13,
        color: "#999",
        marginBottom: 4,
    },
    places: {
        fontSize: 14,
        fontWeight: "500",
        color: "#10B981",
        marginBottom: 12,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    buttonPrimary: {
        flex: 1,
        backgroundColor: "#10B981",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonPrimaryText: {
        color: "#fff",
        fontWeight: "600",
    },
    buttonSecondary: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    buttonSecondaryText: {
        color: "#10B981",
        fontWeight: "600",
    },
    buttonSecondaryTrash: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#f80202ff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },

    buttonSecondaryTextTrash: {
        color: "#F3F4F6",
        fontWeight: "600",
    },
});
