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

    const { request, isLoading, toggleApply } = useApply(
        annonce.id,
        session?.user.id
    );

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
                    {isLoading
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
        </>
    );
}
