import FeatherIcon from "@expo/vector-icons/Feather";
import type { NavigationProp } from "@react-navigation/native";

import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { formatDate } from "../../../utils/formatedDate";
import { ProfileCard } from "../../components/ProfileCard";
import { ActionRow } from "../../components/ui/ActionRaw";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { Section } from "../../components/ui/CustomSection";
import { InfoRow } from "../../components/ui/InfoRaw";
import { useAuth } from "../../contexts/authContext";
import { useNotificationStatus } from "../../contexts/notificationContext";
import { useCurrentUser } from "../../hooks/user/useUsers";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { ProfileStackParamList } from "../../types/navigation/profileStackType";

export default function ProfileScreen() {
    useRequireAuth("ProfileStack");
    const { data: user } = useCurrentUser();
    const { hasNewNotification } = useNotificationStatus();
    const { session } = useAuth();
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const formatedDate = formatDate(session?.user.created_at || "");
    if (!user) return <ActivityIndicator />;

    const right_buttons = (
        <>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("NotificationsScreen");
                }}
            >
                <FeatherIcon name="bell" size={22} color="#1D2A32" />
                {hasNewNotification && (
                    <View
                        style={{
                            position: "absolute",
                            top: -2,
                            right: -2,
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "red",
                        }}
                    />
                )}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate("SettingsScreen")}
            >
                <FeatherIcon name="settings" size={22} color="#1D2A32" />
            </TouchableOpacity>
        </>
    );
    return (
        <ScreenWrapper title="Mon profil" rightActions={right_buttons}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Carte utilisateur */}
                <ProfileCard />

                {/* 🔹 Informations */}
                <Section title="Informations">
                    <InfoRow label="Centre Amazon" value={user?.fc.name} />
                    <InfoRow label="Équipe" value={user?.team} />
                    <InfoRow label="Contrat" value={user?.contract} />
                    <InfoRow label="Ville" value={user?.city} />
                    <InfoRow
                        label="Membre depuis"
                        value={formatedDate}
                        isLast
                    />
                </Section>

                {/* 🔹 Actions */}
                <Section title="Actions">
                    <ActionRow
                        label="Mes favoris"
                        onPress={() => navigation.navigate("FavoriteScreen")}
                    />
                    <ActionRow
                        label="Mes candidatures"
                        onPress={() => navigation.navigate("CandidateProfile")}
                        isLast
                    />
                </Section>

                {/* 🔹 Mentions légales */}
                <Section title="Informations légales">
                    <ActionRow
                        label="Politique de confidentialité"
                        icon="external-link"
                        onPress={() =>
                            Linking.openURL(
                                "https://coworkers-legal.vercel.app/politique_confidentialite",
                            )
                        }
                    />
                    <ActionRow
                        label="Conditions d’utilisation"
                        icon="external-link"
                        onPress={() =>
                            Linking.openURL(
                                "https://coworkers-legal.vercel.app/",
                            )
                        }
                    />
                    <ActionRow
                        label="Contacter le support"
                        icon="mail"
                        onPress={() =>
                            Linking.openURL("mailto:vandevdimitri@gmail.com")
                        }
                        isLast
                    />
                </Section>
            </ScrollView>
        </ScreenWrapper>
    );
}
