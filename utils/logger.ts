import { Platform } from "react-native";
import { supabase } from "../src/infrastructure/supabase";

export const logger = {
    async critical(
        code: string,
        action: string,
        error: any,
        userId?: string | null,
    ) {
        const timestamp = new Date().toISOString();
        const errorMessage = error?.message || "Erreur inconnue";

        if (__DEV__) {
            console.group(
                `%c [${code}] 🚨 CRITICAL ERROR`,
                "color: white; background: red; font-weight: bold;",
            );
            console.error(`Action: ${action}`);
            console.error(`Message: ${errorMessage}`);
            console.error(`Détails:`, error);
            console.groupEnd();
        }

        try {
            await supabase.from("error_logs").insert({
                level: "critical",
                action: `${code} - ${action}`,
                message: errorMessage,
                details: {
                    error_raw: error,
                    stack: error?.stack,
                },
                user_id: userId,
                context: {
                    platform: Platform.OS,
                    version: "1.0.0",
                    timestamp: timestamp,
                },
            });
        } catch (logError) {
            console.error(
                "Échec critique de l'enregistrement du log:",
                logError,
            );
        }
    },
};
