import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../../utils/supabase";
import ApplyButton from "../../components/ApplyButton";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/authContext";

export default function CandidateProfile() {
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
      `
            )
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

        console.log("Candidatures récupérées :", data);

        if (error) {
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
        <SafeScreen backBtn title="Mes candidatures">
            {loading ? (
                <Text>Chargement des candidatures...</Text>
            ) : (
                <FlatList
                    data={applications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </SafeScreen>
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
});
