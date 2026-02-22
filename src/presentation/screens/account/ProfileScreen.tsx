import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AppButton } from "../../components/ui/AppButton";
import { Bento } from "../../components/ui/Bento";
import { MenuItem } from "../../components/ui/MenuItem";
import { MenuSection } from "../../components/ui/MenuSection";
import { UserHeader } from "../../components/ui/UserHeader";
import { useAuth } from "../../hooks/authContext";
import { useCurrentUser } from "../../hooks/queries/useUser";

export default function ProfileScreen({ navigation }: any) {
    const { session } = useAuth();
    const { data: user } = useCurrentUser();
    const formatedDate = session?.user.created_at
        ? new Date(session?.user.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "N/A";

    const headerRight = (
        <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
                // onPress={() => router.back()}
                style={[
                    styles.backButton,
                    { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                ]}
            >
                <Ionicons name="notifications" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
                // onPress={() => router.back()}
                style={[
                    styles.backButton,
                    { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                ]}
            >
                <Ionicons name="settings" size={22} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <ScreenWrapper
            title="Mon profil"
            showBackButton={false}
            headerRight={headerRight}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <UserHeader
                    avatarUrl={user?.profileAvatar}
                    contract={user?.contract}
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    dateLabel={formatedDate}
                />

                <View style={styles.bentoGrid}>
                    <Bento
                        icon="business"
                        label="Site"
                        value={user?.fcName || "N/A"}
                    />
                    <Bento
                        icon="people"
                        label="Équipe"
                        value={user?.team || "N/A"}
                    />
                </View>

                <MenuSection title="Mon Espace">
                    <MenuItem
                        icon="heart"
                        label="Mes favoris"
                        onPress={() => navigation.navigate("FavoriteScreen")}
                    />
                    <MenuItem
                        icon="document-text"
                        label="Candidatures"
                        onPress={() => navigation.navigate("CandidateProfile")}
                    />
                </MenuSection>
                <View style={styles.footerSection}>
                    <TouchableOpacity
                        style={styles.supportLink}
                        onPress={() =>
                            Linking.openURL("mailto:support@example.com")
                        }
                    >
                        <Text style={styles.supportText}>
                            Besoin d'aide ? Contacter le support
                        </Text>
                    </TouchableOpacity>

                    <AppButton
                        title="Déconnexion"
                        variant="danger"
                        onPress={() => console.log("deco")}
                        style={{ width: "100%" }}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 150 },
    roleBadge: {
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    bentoGrid: {
        flexDirection: "row",
        gap: 15,
        marginBottom: 30,
        justifyContent: "center",
    },
    footerSection: { alignItems: "center" },
    supportLink: { marginBottom: 20 },
    supportText: { color: "#3B82F6", fontSize: 14 },

    backButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
});
