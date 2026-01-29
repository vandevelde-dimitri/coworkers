import FeatherIcon from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { formatDate } from "../../../utils/formatedDate";
import SafeScreen from "../../components/SafeScreen";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import ConfirmModal from "../../components/ui/ConfirmModal";
import ScreenWrapper from "../../components/ui/CustomHeader";
import EmptyState from "../../components/ui/EmptyComponent";
import RemoveParticipantButton from "../../components/ui/RemoveParticipantButton";
import SmartImage from "../../components/ui/SmartImage";
import { useAuth } from "../../contexts/authContext";
import {
    useAnnouncementCurrentUser,
    useDeleteAnnouncement,
} from "../../hooks/announcement/useAnnouncement";
import { useRequireAuth } from "../../hooks/useRequireAuth";

export default function TravelScreen() {
    useRequireAuth();
    const [open, setOpen] = useState(false);
    const { session } = useAuth();
    const navigation = useNavigation();
    const {
        data: announcement,
        isLoading,
        error,
    } = useAnnouncementCurrentUser();
    const { mutate: deleteAnnouncement } = useDeleteAnnouncement();

    if (!session) return <ActivityIndicator />;

    // 1️⃣ Loading
    if (isLoading) {
        return (
            <SafeScreen title="Mon annonce">
                <Text>Chargement...</Text>
            </SafeScreen>
        );
    }

    // 2️⃣ Erreur
    if (error) {
        return (
            <SafeScreen title="Mon annonce">
                <Text>Une erreur est survenue.</Text>
            </SafeScreen>
        );
    }

    if (!announcement) {
        return (
            <ScreenWrapper title="Mon annonce">
                <EmptyState
                    title="Aucun trajet enregistré"
                    description="Vous n’avez pas encore créé de trajet."
                    actionLabel="Créer une annonce"
                    onAction={() =>
                        (navigation as any).navigate("FormStack", {
                            screen: "FormAnnouncementScreen",
                        })
                    }
                />
            </ScreenWrapper>
        );
    }

    // ---------- FORMATTING ----------
    const dateStart = formatDate(announcement.date_start);
    const dateEnd = announcement.date_end
        ? formatDate(announcement.date_end)
        : null;

    // ---------- RENDER ----------
    return (
        <ScreenWrapper title="Mon annonce">
            <ScrollView>
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
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <FeatherIcon name="truck" size={16} color="#2563eb" />
                        <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                            {announcement.owner.settings.to_convey
                                ? "véhiculer"
                                : "non véhiculer"}
                        </Text>
                    </View>
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
                            .map((p) => (
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
                                        <View style={{ marginLeft: 12 }}>
                                            <Text style={{ fontWeight: "500" }}>
                                                {p.users.firstname}
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 4,
                                                }}
                                            >
                                                <FeatherIcon
                                                    name="truck"
                                                    size={12}
                                                    color={
                                                        p.users.settings
                                                            .to_convey
                                                            ? "#2563eb"
                                                            : "#94a3b8"
                                                    }
                                                />
                                                <Text
                                                    style={{
                                                        fontSize: 11,
                                                        color: p.users.settings
                                                            .to_convey
                                                            ? "#2563eb"
                                                            : "#6b7280",
                                                    }}
                                                >
                                                    {p.users.settings.to_convey
                                                        ? "Véhiculé"
                                                        : "Non véhiculé"}
                                                </Text>
                                            </View>
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

                                    <RemoveParticipantButton
                                        annonce={announcement}
                                        participant={p}
                                    />
                                </View>
                            ))
                    )}
                </Card>

                {/* Actions */}

                <Button
                    label="Modifier"
                    variant="primary"
                    onPress={() => {
                        (navigation as any).navigate("FormStack", {
                            screen: "FormAnnouncementScreen",
                            params: { id: announcement.id },
                        });
                    }}
                />
                <Button
                    label="Supprimer"
                    variant="danger"
                    onPress={() => setOpen(true)}
                />
                <ConfirmModal
                    visible={open}
                    title="Supprimer cette annonce ?"
                    description="Cette action est définitive et ne pourra pas être annulée."
                    confirmLabel="Supprimer"
                    onCancel={() => setOpen(false)}
                    onConfirm={() => {
                        setOpen(false);
                        deleteAnnouncement(announcement.id);
                        //! chercher les différences entre navigation.navigate et navigation.popToTop
                        navigation.popToTop();
                    }}
                    danger
                />
            </ScrollView>
        </ScreenWrapper>
    );
}
