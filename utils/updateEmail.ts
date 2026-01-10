import { Alert } from "react-native";
import { useAuth } from "../src/contexts/authContext";
import { supabase } from "./supabase";

export const onUpdateEmail = async ({ email }) => {
    const { refreshSession } = useAuth();

    try {
        await supabase.auth.updateUser({ email });

        await refreshSession();

        Alert.alert("Succès", "Email mis à jour");
    } catch (e: any) {
        Alert.alert("Erreur", e.message);
    }
};
