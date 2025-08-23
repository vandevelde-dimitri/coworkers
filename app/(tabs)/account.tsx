import SafeScreen from "@/components/SafeScreen";
import { useCurrentUser } from "@/hooks/user/useUsers";
import { Contract } from "@/types/enum/contract.enum";
import { supabase } from "@/utils/supabase";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
    const { data: user } = useCurrentUser();

    if (!user) {
        return (
            <SafeScreen title="Mon Profil" backBtn={true}>
                <View style={styles.centered}>
                    <Text style={{ color: "#6B7280" }}>
                        Utilisateur introuvable
                    </Text>
                </View>
            </SafeScreen>
        );
    }

    const handleClick = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error(error);
    };

    return (
        <SafeScreen title="Mon Profil" backBtn={false}>
            <View style={styles.container}>
                {/* Avatar + Infos */}
                <View style={styles.header}>
                    <Image
                        source={{
                            uri:
                                user.image_profile ||
                                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
                        }}
                        style={styles.avatar}
                    />
                    <View style={styles.info}>
                        <Text style={styles.name}>
                            {user.firstname} {user.lastname}
                        </Text>
                        <Text style={styles.team}>{user.team}</Text>
                        <Text style={styles.contract}>
                            {user.contract === Contract.CDI
                                ? "Contrat : CDI"
                                : user.contract === Contract.CDD
                                ? "Contrat : CDD"
                                : "Contrat : Autre"}
                        </Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.section}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Annonces</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Favoris</Text>
                    </View>
                </View>

                {/* Separator */}
                <View style={styles.separator} />

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.buttonPrimary}>
                        <Text style={styles.buttonText}>
                            Modifier mon profil
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonDanger}
                        onPress={handleClick}
                    >
                        <Text style={styles.buttonTextDanger}>
                            Se déconnecter
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
        backgroundColor: "#f3f4f6",
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    team: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 2,
    },
    contract: {
        fontSize: 13,
        color: "#10B981",
        marginTop: 4,
    },
    section: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
    statBox: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    statLabel: {
        fontSize: 13,
        color: "#6B7280",
    },
    separator: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 20,
    },
    actions: {
        gap: 12,
    },
    buttonPrimary: {
        backgroundColor: "#2563EB",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonDanger: {
        backgroundColor: "#FEE2E2",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
    buttonTextDanger: {
        color: "#DC2626",
        fontWeight: "600",
    },
});
