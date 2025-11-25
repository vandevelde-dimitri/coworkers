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
            { onConflict: "user_id,annonce_id" }
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
});
