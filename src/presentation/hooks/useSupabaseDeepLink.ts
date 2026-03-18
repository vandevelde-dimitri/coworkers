import { supabase } from "@/src/infrastructure/supabase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export const useSupabaseDeepLink = () => {
  const url = Linking.useURL();
  const router = useRouter();

  useEffect(() => {
    const handleTokenNavigation = async (rawUrl: string) => {
      // 1. On ne traite que les URLs de récupération
      if (
        !rawUrl.includes("type=recovery") &&
        !rawUrl.includes("reset-password")
      )
        return;

      if (__DEV__) console.log("🔗 Analyse du Deep Link...");

      // 2. Extraction manuelle des tokens (Gestion du #)
      const hashIndex = rawUrl.indexOf("#");
      if (hashIndex === -1) return;

      const hashFragment = rawUrl.substring(hashIndex + 1);
      const params = new URLSearchParams(hashFragment);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken) {
        if (__DEV__)
          console.log("🔑 Tokens trouvés ! Synchronisation Supabase...");

        // 3. On injecte manuellement la session dans le SDK
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (!error) {
          if (__DEV__) console.log("✅ Session OK. Redirection forcée.");
          // On redirige vers l'écran de reset
          router.replace("/(auth)/reset-password");
        } else {
          console.error("❌ Erreur setSession:", error.message);
        }
      }
    };

    if (url) {
      handleTokenNavigation(url);
    }
  }, [url]);

  return { isDeepLinkLoading: !!url && url.includes("#access_token") };
};
