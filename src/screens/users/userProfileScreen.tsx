import { useRoute } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { formatDate } from "../../../utils/formatedDate";
import { ProfileCardUser } from "../../components/ProfileCardUser";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { Section } from "../../components/ui/CustomSection";
import { InfoRow } from "../../components/ui/InfoRaw";
import { useAuth } from "../../contexts/authContext";
import { useGetUser } from "../../hooks/user/useUsers";

export default function UserScreen() {
    // useRequireAuth("ProfileStack");
    const route = useRoute();
    const { id } = route.params as { id: string };
    const { data: user } = useGetUser(id);
    const { session } = useAuth();
    const formatedDate = formatDate(session?.user.created_at || "");
    if (!user) return <ActivityIndicator />;

    return (
        <ScreenWrapper title={`Profil de ${user.firstname} `}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Carte utilisateur */}
                <ProfileCardUser user={user} />
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
            </ScrollView>
        </ScreenWrapper>
    );
}
