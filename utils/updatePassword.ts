import { showToast } from "./showToast";
import { supabase } from "./supabase";

export const onUpdatePassword = async ({ password }: { password: string }) => {
    if (!password) return;

    try {
        await supabase.auth.updateUser({ password });
        showToast("success", "Mot de passe modifié avec succès");
    } catch (e: any) {
        showToast("error", "Erreur lors de la mise à jour du mot de passe");
    }
};
