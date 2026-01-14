import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
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
        session?.user.id
    );

    const isCancelAction =
        request?.status === "pending" || request?.status === "accepted";

    const label = isLoading
        ? "En cours..."
        : request?.status === "accepted"
        ? "Annuler la participation"
        : request?.status === "pending"
        ? "Annuler la candidature"
        : request?.status === "refused"
        ? "Postuler à nouveau"
        : "Postuler";

    const onPress = async () => {
        if (!session) {
            await SecureStore.setItemAsync(
                "redirectTo",
                JSON.stringify({
                    screen: "AnnonceDetail",
                    params: { id: annonce.id },
                })
            );
            navigation.navigate("Public" as never);
            return;
        }
        if (isCancelAction) {
            setConfirmOpen(true);
            return;
        }
        await toggleApply();
    };

    if (annonce.number_of_places <= 0) {
        return (
            <TouchableOpacity
                style={{
                    backgroundColor: "#dce1e9",
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 10,
                }}
                disabled
            >
                <Text
                    style={{
                        color: "#000000",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    Complet
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: "#2563eb",
                    padding: 16,
                    borderRadius: 16,
                    marginBottom: 10,
                }}
                onPress={onPress}
                disabled={isLoading}
            >
                <Text
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                    }}
                >
                    {label}
                </Text>
            </TouchableOpacity>
            <ConfirmModal
                visible={confirmOpen}
                title={
                    request?.status === "accepted"
                        ? "Voulez-vous annuler votre participation ?"
                        : "Voulez-vous annuler votre candidature ?"
                }
                description="Cette action peut être annulée plus tard."
                confirmLabel="Confirmer"
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
