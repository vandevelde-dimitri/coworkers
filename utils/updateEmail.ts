import { useAuth } from "../src/contexts/authContext";
import { showToast } from "./showToast";
import { supabase } from "./supabase";

export function useUpdateEmail() {
    const { refreshSession } = useAuth();

    const updateEmail = async (email: string) => {
        try {
            const { error } = await supabase.auth.updateUser({ email });

            if (error) throw error;

            await refreshSession();

            showToast(
                "success",
                "Email mis à jour",
                "Un email de confirmation a été envoyé à votre nouvelle adresse.",
            );
        } catch (e: any) {
            showToast("error", "Erreur", "Impossible de mettre à jour l'email");
        }
    };

    return { updateEmail };
}
