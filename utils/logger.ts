import Constants from "expo-constants";
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

    const details = __DEV__
      ? { error_raw: error, stack: error?.stack }
      : { message: errorMessage };

    try {
      await supabase.from("error_logs").insert({
        level: "critical",
        action: `${code} - ${action}`,
        message: errorMessage,
        details: details,
        user_id: userId,
        context: {
          platform: Platform.OS,
          version: Constants.expoConfig?.version ?? "unknown",
          timestamp: timestamp,
        },
      });
    } catch (logError) {
      if (__DEV__) console.error("Échec du logging:", logError);
    }
  },
};
