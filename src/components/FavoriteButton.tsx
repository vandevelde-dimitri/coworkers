import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
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
        <TouchableOpacity
            style={{
                backgroundColor: "#2563eb",
                padding: 16,
                borderRadius: 16,
                marginBottom: 10,
            }}
            onPress={toggleFavorite}
        >
            <Text
                style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "600",
                }}
            >
                {isFavorite ? "Retirer" : "Ajouter"} favoris
            </Text>
        </TouchableOpacity>
    );
}
