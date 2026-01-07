import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { supabase } from "../../utils/supabase";
import { useAuth } from "../contexts/authContext";
import { AnnonceDetail } from "../types/announcement.interface";

export default function ApplyButton({ annonce }: { annonce: AnnonceDetail }) {
    const { session } = useAuth();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    console.log("annonce", annonce);

    const annonceId = annonce.id;

    // 🔎 Charger la candidature si elle existe (pending)
    useEffect(() => {
        if (!session) return;

        const loadRequest = async () => {
            const { data } = await supabase
                .from("participant_requests")
                .select("*")
                .eq("annonce_id", annonceId)
                .eq("user_id", session.user.id)
                // .eq("status", "pending")
                .maybeSingle();

            setRequest(data);
        };

        loadRequest();
    }, [session, annonceId]);

    // 🔄 Postuler ou annuler
    const handleApplyToggle = async () => {
        if (!session) {
            Alert.alert("Connexion requise");
            return;
        }

        try {
            setLoading(true);

            if (request) {
                // 🗑 Annuler sa candidature
                const { error } = await supabase
                    .from("participant_requests")
                    .delete()
                    .eq("annonce_id", annonceId)
                    .eq("user_id", session.user.id);

                if (error) throw error;

                // ❌ Supprimer de conversation si déjà validé
                if (request.status === "accepted") {
                    // 🔎 Récupérer la conversation liée à l'annonce
                    const { data: conversation, error: convError } =
                        await supabase
                            .from("conversations")
                            .select("id")
                            .eq("annonce_id", annonceId)
                            .maybeSingle();

                    if (convError || !conversation)
                        throw (
                            convError ?? new Error("Conversation introuvable")
                        );

                    // ❌ Supprimer de la conversation
                    await supabase
                        .from("conversation_participants")
                        .delete()
                        .eq("conversation_id", conversation.id)
                        .eq("user_id", session.user.id);
                }

                setRequest(null);
                // 🎯 Alert selon le statut
                if (request.status === "refused") {
                    Alert.alert(
                        "Candidature refusée",
                        "Tu as été refusé pour cette annonce, candidature annulée."
                    );
                } else if (request.status === "accepted") {
                    Alert.alert(
                        "Candidature acceptée",
                        "Ta candidature acceptée a été annulée."
                    );
                } else {
                    Alert.alert("Succès", "Ta candidature a été annulée");
                }
            } else {
                // ➕ Postuler
                const { data, error } = await supabase
                    .from("participant_requests")
                    .insert({
                        annonce_id: annonceId,
                        user_id: session.user.id,
                        status: "pending",
                    })
                    .select()
                    .single();

                if (error) throw error;

                setRequest(data);

                Alert.alert("Succès", "Tu as postulé à l'annonce !");
            }
        } catch (e: any) {
            Alert.alert(
                "Erreur",
                e.message ?? "Impossible d'effectuer l'action"
            );
        } finally {
            setLoading(false);
        }
    };

    // 🚫 Plus de place
    if (annonce.number_of_places <= 0) {
        return (
            <TouchableOpacity
                style={{
                    backgroundColor: "#2563eb",
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 10,
                }}
                disabled
            >
                <Text
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    Complet
                </Text>
            </TouchableOpacity>
        );
    }

    console.log("requests:", request);

    // ✅ Affichage du bouton selon l'état
    return (
        <TouchableOpacity
            style={{
                backgroundColor: "#2563eb",
                padding: 16,
                borderRadius: 16,
                marginBottom: 10,
            }}
            onPress={handleApplyToggle}
            disabled={loading}
        >
            <Text
                style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "600",
                }}
            >
                {loading
                    ? "En cours..."
                    : request?.status === "accepted"
                    ? "Annuler la participation"
                    : request?.status === "pending"
                    ? "Annuler la candidature"
                    : request?.status === "refused"
                    ? "Postuler à nouveau"
                    : "Postuler"}
            </Text>
        </TouchableOpacity>
    );
}
