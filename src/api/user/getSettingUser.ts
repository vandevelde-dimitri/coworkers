import { supabase } from "../../../utils/supabase";

// src/api/settings.ts
export async function getSettingUser(userId: string | undefined) {
    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        // 🔴 On log l'erreur technique pour nous (Audit : console.log uniquement en DEV)
        if (__DEV__) console.error("Détail technique Supabase:", error);

        // 🟢 On jette une erreur avec un message "propre" pour l'utilisateur
        // C'est ce message que error.message contiendra dans ton hook
        throw new Error("Impossible de charger vos préférences.");
    }

    return data;
}
