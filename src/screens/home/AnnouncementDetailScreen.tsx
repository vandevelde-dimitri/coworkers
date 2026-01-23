import {
    NavigationProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { isMyAnnouncement } from "../../../utils/announcementUtils";
import ApplyButton from "../../components/ApplyButton";
import FavoriteButton from "../../components/FavoriteButton";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import ConfirmModal from "../../components/ui/ConfirmModal";
import ScreenWrapper from "../../components/ui/CustomHeader";
import RemoveParticipantButton from "../../components/ui/RemoveParticipantButton";
import SmartImage from "../../components/ui/SmartImage";
import { useAuth } from "../../contexts/authContext";
import {
    useAnnouncementById,
    useDeleteAnnouncement,
} from "../../hooks/announcement/useAnnouncement";
import { HomeStackParamList } from "../../types/navigation/homeStackType";

export default function AnnouncementDetailScreen() {
    const route = useRoute();
    const { id } = route.params as { id: string };
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const { session } = useAuth();
    const [open, setOpen] = useState(false);
    const { data: announcement, isLoading, error } = useAnnouncementById(id);
    const { mutate: deleteAnnouncement } = useDeleteAnnouncement();
    const isOwner = isMyAnnouncement(announcement, session?.user.id);

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error loading announcement</Text>;
    if (!announcement) return <Text>Annonce introuvable</Text>;

    return (
        <ScreenWrapper title="Détails de l'annonce" back>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Détail annonce */}
                <Card>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "700",
                            marginBottom: 6,
                        }}
                    >
                        {announcement.title}
                    </Text>
                    <Text style={{ color: "#374151" }}>
                        {announcement.content}
                    </Text>
                    <Text style={{ marginTop: 6 }}>
                        Places disponibles : {announcement.number_of_places}
                    </Text>
                </Card>

                {/* Propriétaire */}
                <Card>
                    <Text style={{ fontWeight: "600", marginBottom: 10 }}>
                        Annonce de
                    </Text>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <SmartImage size={44} userData={announcement.owner} />
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

                    {announcement.participant_requests.filter(
                        (p) => p.status === "accepted",
                    ).length === 0 ? (
                        <Text style={{ color: "#6b7280", fontStyle: "italic" }}>
                            Aucun participant pour le moment.
                        </Text>
                    ) : (
                        announcement.participant_requests
                            .filter((p) => p.status === "accepted")
                            .map(
                                (p) => (
                                    console.log("Rendering participant:", p),
                                    (
                                        <View
                                            key={p.user_id}
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
                                                <SmartImage
                                                    size={44}
                                                    userData={p.users}
                                                />
                                                <View
                                                    style={{ marginLeft: 12 }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {p.users.firstname}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 12,
                                                            color: "#6b7280",
                                                        }}
                                                    >
                                                        {p.users.city}
                                                    </Text>
                                                </View>
                                            </View>

                                            {isOwner && (
                                                <RemoveParticipantButton
                                                    annonce={announcement}
                                                    participant={p}
                                                />
                                            )}
                                        </View>
                                    )
                                ),
                            )
                    )}
                </Card>

                {/* Actions */}
                {isOwner ? (
                    <>
                        <Button
                            label="Modifier"
                            variant="primary"
                            onPress={() =>
                                navigation.navigate("FormStack", {
                                    screen: "FormAnnouncementScreen",
                                    params: { id },
                                })
                            }
                        />
                        <Button
                            label="Supprimer"
                            onPress={() => setOpen(true)}
                            variant="danger"
                        />
                        <ConfirmModal
                            visible={open}
                            title="Supprimer cette annonce ?"
                            description="Cette action est définitive et ne pourra pas être annulée."
                            confirmLabel="Supprimer"
                            onCancel={() => setOpen(false)}
                            onConfirm={() => {
                                setOpen(false);
                                deleteAnnouncement(id);
                                navigation.popToTop();
                            }}
                            danger
                        />
                    </>
                ) : (
                    <>
                        <ApplyButton annonce={announcement} />
                        <FavoriteButton annonceId={announcement.id} />
                    </>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
}
