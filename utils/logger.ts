import { Platform } from "react-native";
import { supabase } from "./supabase";

export const logger = {
    async critical(action: string, error: any, userId?: string) {
        if (__DEV__) {
            console.error(`[CRITICAL] ${action}:`, error);
        }

        try {
            await supabase.from("error_logs").insert({
                level: "critical",
                action,
                message: error?.message || "Erreur inconnue",
                details: error,
                user_id: userId,
                context: {
                    platform: Platform.OS,
                    version: "1.0.0",
                    timestamp: new Date().toISOString(),
                },
            });
        } catch (logError) {
            console.error("Impossible d'envoyer le log à Supabase:", logError);
        }
    },
};
