import { Alert } from "react-native";
import { supabase } from "./supabase";

export const onUpdatePassword = async ({ password }) => {
    if (!password) return;

    try {
        await supabase.auth.updateUser({ password });
        Alert.alert("Succès", "Mot de passe modifié");
    } catch (e: any) {
        Alert.alert("Erreur", e.message);
    }
};
