import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { showToast } from "../../utils/showToast";
import { useAuth } from "../contexts/authContext";
import { useApply } from "../hooks/useApply";
import { AnnonceDetail } from "../types/announcement.interface";
import ConfirmModal from "./ui/ConfirmModal";

export default function ApplyButton({ annonce }: { annonce: AnnonceDetail }) {
    const { session } = useAuth();
    const navigation = useNavigation();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { request, isLoading, toggleApply } = useApply(
        annonce.id,
        session?.user.id,
    );

    const status = request?.status;
    const isFull = annonce.number_of_places <= 0;

    // 1. Définition des états visuels
    const getButtonConfig = () => {
        if (isLoading)
            return { label: "Chargement...", color: "#93c5fd", disabled: true };

        switch (status) {
            case "accepted":
                return {
                    label: "Annuler ma participation",
                    color: "#ef4444",
                    disabled: false,
                };
            case "pending":
                return {
                    label: "Annuler la candidature",
                    color: "#f59e0b",
                    disabled: false,
                };
            case "refused":
                return {
                    label: "Candidature refusée",
                    color: "#d1d5db",
                    disabled: true,
                };
            case "removed_by_owner":
                return {
                    label: "Retiré de l'annonce",
                    color: "#374151",
                    disabled: true,
                };
            default:
                // Si l'annonce est pleine et que je ne suis pas déjà dedans
                if (isFull)
                    return {
                        label: "Complet",
                        color: "#d1d5db",
                        disabled: true,
                    };
                return { label: "Postuler", color: "#2563eb", disabled: false };
        }
    };

    const config = getButtonConfig();

    const onPress = async () => {
        if (!session) {
            // ... (ton code SecureStore pour la redirection)
            return;
        }

        // Si c'est une action d'annulation, on ouvre la modale
        if (status === "pending" || status === "accepted") {
            setConfirmOpen(true);
            return;
        }

        try {
            await toggleApply();
            showToast("success", "Candidature envoyée");
        } catch (error) {
            showToast("error", "Erreur lors de l'envoi");
        }
    };

    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: config.color,
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 10,
                    opacity: config.disabled && status !== "refused" ? 0.7 : 1,
                }}
                onPress={onPress}
                disabled={config.disabled}
            >
                <Text
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    {config.label}
                </Text>
            </TouchableOpacity>

            <ConfirmModal
                visible={confirmOpen}
                title="Confirmer l'annulation ?"
                description={
                    status === "accepted"
                        ? "En annulant votre participation, vous libérez une place pour un autre utilisateur."
                        : "Voulez-vous vraiment annuler votre demande ?"
                }
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    setConfirmOpen(false);
                    await toggleApply();
                }}
                danger
            />
        </>
    );
}
