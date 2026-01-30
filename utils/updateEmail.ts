import { Alert } from "react-native";
import { useAuth } from "../src/contexts/authContext";
import { supabase } from "./supabase";

// ✅ On transforme la fonction en Hook (commence par 'use')
export function useUpdateEmail() {
    const { refreshSession } = useAuth(); // Ici, le hook est autorisé !

    const updateEmail = async (email: string) => {
        try {
            const { error } = await supabase.auth.updateUser({ email });

            if (error) throw error;

            // On rafraîchit la session pour que l'UI affiche le nouvel email
            await refreshSession();

            Alert.alert(
                "Succès",
                "Un email de confirmation a été envoyé à votre nouvelle adresse.",
            );
        } catch (e: any) {
            Alert.alert(
                "Erreur",
                e.message || "Impossible de mettre à jour l'email",
            );
        }
    };

    return { updateEmail };
}
