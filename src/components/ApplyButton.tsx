import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { onApply } from "../../utils/onApply";
import { supabase } from "../../utils/supabase";
import { useAuth } from "../contexts/authContext";

export default function ApplyButton({ annonce }: { annonce: any }) {
    const { session } = useAuth();
    const [alreadyJoined, setAlreadyJoined] = useState(false);
    const [loading, setLoading] = useState(false);

    const annonceId = annonce.id;
    const conversationId = annonce.conversation_id;

    // 🔎 Vérifier si l'utilisateur est déjà dans la conversation
    useEffect(() => {
        const checkParticipant = async () => {
            if (!session || !conversationId) return;

            const { data } = await supabase
                .from("conversation_participants")
                .select("id")
                .eq("conversation_id", conversationId)
                .eq("user_id", session.user.id)
                .maybeSingle();

            setAlreadyJoined(!!data);
        };

        checkParticipant();
    }, [session, conversationId]);

    const handleApply = async () => {
        if (!session) {
            Alert.alert("Connexion requise");
            return;
        }

        try {
            setLoading(true);
            await onApply(annonceId);
            setAlreadyJoined(true);

            Alert.alert("Succès", "Tu as rejoint la conversation 🎉");
        } catch (e: any) {
            Alert.alert("Erreur", e.message ?? "Impossible de postuler");
        } finally {
            setLoading(false);
        }
    };

    // 🚫 Plus de place
    if (annonce.number_of_places <= 0) {
        return (
            <TouchableOpacity style={styles.buttonPrimary} disabled>
                <Text style={styles.buttonPrimaryText}>Complet</Text>
            </TouchableOpacity>
        );
    }

    // ✅ Déjà dans la conversation
    if (alreadyJoined) {
        return (
            <TouchableOpacity style={styles.buttonPrimary} disabled>
                <Text style={styles.buttonPrimaryText}>Déjà participant</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleApply}
            disabled={loading}
        >
            <Text style={styles.buttonPrimaryText}>
                {loading ? "En cours..." : "Postuler"}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    content: { padding: 16, justifyContent: "center" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
    userSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    avatar: { width: 50, height: 50, borderRadius: 50, borderWidth: 2 },
    userName: { fontSize: 16, fontWeight: "600" },
    city: { fontSize: 13, color: "#999", marginTop: 2 },
    contentText: { fontSize: 15, color: "#333", marginBottom: 8 },
    dates: { fontSize: 13, color: "#999", marginBottom: 4 },
    places: {
        fontSize: 14,
        fontWeight: "500",
        color: "#10B981",
        marginBottom: 12,
    },
    actions: {
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 12,
    },
    buttonPrimary: {
        flex: 1,
        backgroundColor: "#10B981",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonPrimaryText: { color: "#fff", fontWeight: "600" },
    buttonSecondary: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    buttonSecondaryText: { color: "#10B981", fontWeight: "600" },
    buttonSecondaryTrash: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#f80202ff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    buttonSecondaryTextTrash: { color: "#F3F4F6", fontWeight: "600" },
    noVehicle: {
        marginTop: 4,
        color: "#ff0000",
        fontWeight: "600",
        fontSize: 14,
        marginBottom: 12,
    },
});
