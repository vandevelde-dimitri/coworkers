import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { supabase } from "../../utils/supabase";
import { useAuth } from "../contexts/authContext";

export default function FavoriteButton({ annonceId }: { annonceId: string }) {
    const { session } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkFavorite = async () => {
            if (!session) return;
            const { data, error } = await supabase
                .from("user_annonces")
                .select("favorite")
                .eq("user_id", session.user.id)
                .eq("annonce_id", annonceId)
                .maybeSingle();

            if (!error && data) {
                setIsFavorite(data.favorite);
            }
        };
        checkFavorite();
    }, [session, annonceId]);

    const toggleFavorite = async () => {
        if (!session) return;

        const newValue = !isFavorite;

        // upsert : insère ou met à jour
        const { error } = await supabase.from("user_annonces").upsert(
            [
                {
                    user_id: session.user.id,
                    annonce_id: annonceId,
                    favorite: newValue,
                },
            ],
            { onConflict: "user_id,annonce_id" } // ou "user_id,annonce_id" selon client
        );

        if (error) {
            console.log("Erreur mise à jour favori:", error.message);
        } else {
            setIsFavorite(newValue);
        }
    };

    return (
        <TouchableOpacity style={styles.buttonPrimary} onPress={toggleFavorite}>
            <Text style={styles.buttonPrimaryText}>
                {isFavorite ? "Retirer" : "Ajouter"} favoris
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        justifyContent: "center",
    },
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
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
    },
    userSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
    },
    city: {
        fontSize: 13,
        color: "#999",
        marginTop: 2,
    },
    contentText: {
        fontSize: 15,
        color: "#333",
        marginBottom: 8,
    },
    dates: {
        fontSize: 13,
        color: "#999",
        marginBottom: 4,
    },
    places: {
        fontSize: 14,
        fontWeight: "500",
        color: "#10B981",
        marginBottom: 12,
    },
    actions: {
        flexDirection: "row",
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
    buttonPrimaryText: {
        color: "#fff",
        fontWeight: "600",
    },
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
    buttonSecondaryText: {
        color: "#10B981",
        fontWeight: "600",
    },
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

    buttonSecondaryTextTrash: {
        color: "#F3F4F6",
        fontWeight: "600",
    },
});
