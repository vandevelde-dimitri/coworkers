import {
    NavigationProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { isMyAnnouncement } from "../../../utils/announcementUtils";
import ApplyButton from "../../components/ApplyButton";
import FavoriteButton from "../../components/FavoriteButton";
import { Avatar } from "../../components/ui/Avatar";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../../contexts/authContext";
import {
    useAnnouncementById,
    useDeleteAnnouncement,
} from "../../hooks/announcement/useAnnouncement";
import { useRemoveParticipant } from "../../hooks/candidate/useCandidate";
import { HomeStackParamList } from "../../types/navigation/homeStackType";

export default function AnnouncementDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const { id } = route.params as { id: string };
    const { session } = useAuth();

    const { data: announcement, isLoading, error } = useAnnouncementById(id);
    const { mutate: deleteAnnouncement } = useDeleteAnnouncement();
    const { mutate: removeParticipant } = useRemoveParticipant();
    const isOwner = isMyAnnouncement(announcement, session?.user.id);

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading announcement</Text>;
    if (!announcement) return <Text>Annonce introuvable</Text>;

    const handleEdit = () => {
        if (!isOwner) return;
        navigation.navigate("FormStack", {
            screen: "FormAnnouncementScreen",
            params: { id },
        });
    };

    const handleDelete = () => {
        if (!isOwner) return;
        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment supprimer cette annonce ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => {
                        deleteAnnouncement(id);
                        navigation.popToTop();
                    },
                },
            ]
        );
    };

    const handleRemoveParticipant = (participantId: string) => {
        if (!isOwner) return;
        const participant = announcement.participant_requests.find(
            (p) => p.user_id === participantId
        );
        if (!participant) return;
        Alert.alert(
            "Confirmation",
            `Voulez-vous vraiment retirer ${participant.users.firstname} de cette annonce ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Retirer",
                    style: "destructive",
                    onPress: () => {
                        removeParticipant({
                            annonceId: announcement.id,
                            participantId,
                            conversationId: announcement.conversation_id,
                        });
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={{ padding: 16 }}>
            {/* Détail annonce */}
            <Card>
                <Text
                    style={{ fontSize: 20, fontWeight: "700", marginBottom: 6 }}
                >
                    {announcement.title}
                </Text>
                <Text style={{ color: "#374151" }}>{announcement.content}</Text>
                <Text style={{ marginTop: 6 }}>
                    Places disponibles : {announcement.number_of_places}
                </Text>
            </Card>

            {/* Propriétaire */}
            <Card>
                <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                    Annonce de
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar uri={announcement.owner.image_profile} />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontWeight: "600" }}>
                            {announcement.owner.firstname}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#6b7280" }}>
                            {announcement.owner.city}
                        </Text>
                    </View>
                </View>
            </Card>

            {/* Participants */}
            <Card>
                <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                    Participants
                </Text>
                {announcement.participant_requests.map((p) => (
                    <View
                        key={p.id}
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
                                uri={
                                    p.users.image_profile ||
                                    "https://i.pravatar.cc/150?img=12"
                                }
                            />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={{ fontWeight: "500" }}>
                                    {p.users.firstname}
                                </Text>
                                <Text
                                    style={{ fontSize: 12, color: "#6b7280" }}
                                >
                                    {p.users.city}
                                </Text>
                            </View>
                        </View>
                        {isOwner && (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: "#fee2e2",
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 10,
                                }}
                                onPress={() =>
                                    handleRemoveParticipant(p.user_id)
                                }
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
                        )}
                    </View>
                ))}
            </Card>

            {/* Actions */}
            {isOwner ? (
                <>
                    <TouchableOpacity
                        onPress={handleEdit}
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
                        onPress={handleDelete}
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
                    <ApplyButton annonce={announcement} />
                    <FavoriteButton annonceId={announcement.id} />
                    <Text
                        style={{
                            textAlign: "center",
                            marginTop: 10,
                            color: "#6b7280",
                        }}
                    >
                        {announcement.myStatus &&
                            `Statut : ${announcement.myStatus}`}
                    </Text>
                </>
            )}
        </ScrollView>
    );
}
