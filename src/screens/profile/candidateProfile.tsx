import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../../utils/supabase";
import ApplyButton from "../../components/ApplyButton";
import ScreenWrapper from "../../components/ui/CustomHeader";
import EmptyState from "../../components/ui/EmptyComponent";
import { useAuth } from "../../contexts/authContext";

export default function CandidateProfile() {
    const navigation = useNavigation();

    const { session } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔄 Charger toutes mes candidatures
    const loadApplications = async () => {
        if (!session) return;

        setLoading(true);

        const { data, error } = await supabase
            .from("participant_requests")
            .select(
                `
         id,
        status,
        created_at,
        annonces (
          id,
          title,
          number_of_places
        )
      `,
            )
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

        if (error) {
            if (__DEV__)
                console.error("Erreur chargement candidatures :", error);
            setApplications([]);
        } else {
            setApplications(data ?? []);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadApplications();
    }, [session]);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.annonces.title}</Text>
            <Text style={styles.date}>
                Postulé le : {new Date(item.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.status}>
                Status :
                {item.status === "pending"
                    ? " En attente de réponse"
                    : item.status === "accepted"
                      ? " Accepté"
                      : " Refusé"}
            </Text>
            {/* Bouton postuler / annuler */}
            <ApplyButton
                annonce={{
                    ...item.annonces,
                    conversation_id: item.conversation_id,
                }}
            />
        </View>
    );

    return (
        <ScreenWrapper back title="Mes candidatures">
            {loading ? (
                <Text>Chargement des candidatures...</Text>
            ) : (
                <FlatList
                    data={applications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingBottom: 32,
                        flexGrow: 1,
                        justifyContent:
                            applications.length === 0 ? "center" : "flex-start",
                    }}
                    ListEmptyComponent={
                        <EmptyState
                            title="Aucune candidature envoyée"
                            description="Vous n’avez encore postulé à aucune annonce."
                            actionLabel="Explorer les annonces"
                            onAction={() =>
                                (navigation as any).navigate("HomeStack", {
                                    screen: "HomeScreen",
                                })
                            }
                        />
                    }
                />
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#F9FAFB",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
        color: "#111827",
    },
    date: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 6,
    },
    status: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 12,
        color: "#10B981",
    },
    emptyContainer: {
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    emptyText: { fontSize: 16, marginBottom: 12 },
    buttonPrimary: {
        backgroundColor: "#10B981",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonPrimaryText: { color: "#fff", fontWeight: "600" },
});
