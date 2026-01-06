import {
    NavigationProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
    canApplyToAnnouncement,
    hasAlreadyApplied,
    isMyAnnouncement,
} from "../../../utils/announcementUtils";
import { formatDate } from "../../../utils/formatedDate";
import { Avatar } from "../../components/ui/Avatar";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../../contexts/authContext";
import {
    useAnnouncementById,
    useDeleteAnnouncement,
} from "../../hooks/announcement/useAnnouncement";
import { HomeStackParamList } from "../../types/navigation/homeStackType";

export default function AnnouncementDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const [canApply, setCanApply] = useState<boolean>(false);
    const [hasApplied, setHasApplied] = useState<boolean>(false);
    const { id } = route.params as { id: string };
    const { session } = useAuth();

    const { data: announcement, isLoading, error } = useAnnouncementById(id);
    const { mutate: deleteAnnouncement } = useDeleteAnnouncement();

    const isOwner = isMyAnnouncement(announcement, session?.user.id);

    useEffect(() => {
        if (!announcement || !session?.user.id) return;

        (async () => {
            const canApplyResult = await canApplyToAnnouncement(announcement);
            setCanApply(canApplyResult);

            const applied = await hasAlreadyApplied(id);
            setHasApplied(applied);
        })();
    }, [announcement, session]);

    const onEdit = () => {
        if (!isOwner) return;
        navigation.navigate("FormStack", {
            screen: "FormAnnouncementScreen",
            params: { id },
        });
    };

    const onDelete = () => {
        if (!isOwner) return;
        deleteAnnouncement(id);
        navigation.popToTop();
    };

    // Affichage des statuts de chargement / erreurs
    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading announcement</Text>;
    if (!announcement) return <Text>Announcement not found</Text>;

    const date_start_formated = formatDate(announcement.date_start);
    const date_end_formated = formatDate(announcement.date_end);

    return (
        <ScrollView style={{ padding: 16 }}>
            <Card>
                <Text
                    style={{ fontSize: 20, fontWeight: "700", marginBottom: 6 }}
                >
                    {announcement.title}
                </Text>
                <Text style={{ color: "#374151" }}>{announcement.content}</Text>
                {/* <Text style={{ marginTop: 6, color: "#6b7280" }}>
                    Départ : 12 Jan · 08:00
                </Text> */}
                <Text style={{ marginTop: 6 }}>
                    Places disponibles : {announcement.number_of_places}
                </Text>
            </Card>

            <Card>
                <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                    Annonce de
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar uri="https://i.pravatar.cc/150?img=12" />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontWeight: "600" }}>
                            {announcement.users.firstname}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#6b7280" }}>
                            {announcement.users.city}
                        </Text>
                    </View>
                </View>
            </Card>

            <Card>
                <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                    Participants
                </Text>
                {[1, 2].map((p) => (
                    <View
                        key={p}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 12,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Avatar
                                uri={`https://i.pravatar.cc/150?img=${30 + p}`}
                            />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={{ fontWeight: "500" }}>
                                    Participant {p}
                                </Text>
                                <Text
                                    style={{ fontSize: 12, color: "#22c55e" }}
                                >
                                    Accepté
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#fee2e2",
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#ef4444",
                                    fontSize: 12,
                                    fontWeight: "600",
                                }}
                            >
                                Retirer
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </Card>

            {isOwner ? (
                <>
                    <TouchableOpacity
                        onPress={onEdit}
                        style={{
                            backgroundColor: "#f59e0b",
                            padding: 16,
                            borderRadius: 16,
                            marginBottom: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontWeight: "600",
                            }}
                        >
                            Modifier
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onDelete}
                        style={{
                            backgroundColor: "#ef4444",
                            padding: 16,
                            borderRadius: 16,
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontWeight: "600",
                            }}
                        >
                            Supprimer
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#2563eb",
                            padding: 16,
                            borderRadius: 16,
                            marginBottom: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontWeight: "600",
                            }}
                        >
                            Postuler
                        </Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            textAlign: "center",
                            marginBottom: 10,
                            color: "#6b7280",
                        }}
                    >
                        Statut : En attente
                    </Text>
                </>
            )}
        </ScrollView>
    );
}
