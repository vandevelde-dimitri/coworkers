import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { canApplyToAnnouncement } from "../../utils/announcementUtils";
import { supabase } from "../../utils/supabase";
import { useAuth } from "../contexts/authContext";
import { StatusNotification } from "../types/enum/statusNotification.enum";

export default function ApplyButton({ annonce }: { annonce: any }) {
    const { session } = useAuth();
    const [status, setStatus] = useState<null | string>(null);
    const [eligible, setEligible] = useState<boolean>(false);

    const annonceId = annonce.id.toString();

    // Vérifier si l’utilisateur est éligible (vehicule user / owner)
    useEffect(() => {
        (async () => {
            const allowed = await canApplyToAnnouncement(annonce);
            setEligible(allowed);
        })();
    }, [annonce]);

    // Charger status (pending ou non)
    useEffect(() => {
        const fetchStatus = async () => {
            if (!session) return;

            const { data, error } = await supabase
                .from("user_annonces")
                .select("status")
                .eq("user_id", session.user.id)
                .eq("annonce_id", annonceId)
                .maybeSingle();

            if (!error && data) {
                setStatus(data.status);
            }
        };

        fetchStatus();
    }, [session, annonceId]);

    const toggleApply = async () => {
        if (!session) return;

        const hasApplied = status === "pending";

        let response;

        if (hasApplied) {
            // Annuler candidature → supprimer la ligne
            response = await supabase
                .from("user_annonces")
                .delete()
                .eq("user_id", session.user.id)
                .eq("annonce_id", annonceId);
        } else {
            // Envoyer candidature → status = pending
            response = await supabase.from("user_annonces").upsert(
                [
                    {
                        user_id: session.user.id,
                        annonce_id: annonceId,
                        status: StatusNotification.PENDING,
                    },
                ],
                { onConflict: "user_id,annonce_id" }
            );
        }

        if (!response.error) {
            setStatus(hasApplied ? null : StatusNotification.PENDING);
        }
    };

    const hasApplied = status === StatusNotification.PENDING;

    // Si pas éligible, afficher message + bouton désactivé
    if (!eligible) {
        return (
            <TouchableOpacity style={[styles.buttonSecondary]} disabled>
                <Text style={styles.buttonSecondaryText}>
                    impossible de postuler
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={[styles.buttonPrimary]} onPress={toggleApply}>
            <Text style={styles.buttonPrimaryText}>
                {hasApplied ? "Annuler" : "Postuler"}
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
