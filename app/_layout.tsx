import { ToastProviderWithViewport } from "@/src/presentation/components/ui/molecules/Toast";
import { NetworkBanner } from "@/src/presentation/components/ui/NetworkBanner";
import { useColorScheme } from "@/src/presentation/components/useColorScheme.web";
import { AuthProvider, useAuth } from "@/src/presentation/hooks/authContext";
import { MessageProvider } from "@/src/presentation/hooks/context/messageContext";
import { NotificationProvider } from "@/src/presentation/hooks/context/notificationContext";
import { useSupabaseDeepLink } from "@/src/presentation/hooks/useSupabaseDeepLink";
import { queryClient } from "@/utils/react-query";
import { FontAwesome } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Font from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProviderWithViewport>
        <AuthProvider>
          <NotificationProvider>
            <MessageProvider>
              <NetworkBanner />
              <RootLayoutNav />
            </MessageProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProviderWithViewport>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  // 1. On récupère isRecovering depuis le contexte
  const { session, loading, profileCompleted, isRecovering } = useAuth();
  const router = useRouter();
  const segments = useSegments() as string[];
  const colorScheme = useColorScheme();

  const [fontsLoaded] = Font.useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Activation du hook de deep link qui gère l'injection des tokens
  useSupabaseDeepLink();

  useEffect(() => {
    // A. Attente du chargement initial (Fonts + Auth + Profil)
    // Grâce au changement dans AuthProvider, loading sera false dès le début si isRecovering est true.
    if (loading || !fontsLoaded) return;

    // B. Détermination du contexte de navigation actuel
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments.includes("onboarding");
    const isOnResetPage = segments.includes("reset-password");

    // 🔥 PRIORITÉ RÉCUPÉRATION (RECOVERY)
    // Si on est en mode recovery ou déjà sur la page de reset, on arrête tout.
    // Cela empêche l'app de rediriger vers /onboarding même si le profil n'est pas encore "chargé".
    if (isRecovering || isOnResetPage) {
      if (__DEV__)
        console.log("[Nav] Mode Recovery actif - Redirections gelées.");
      SplashScreen.hideAsync();
      return;
    }

    // C. LOGIQUE DE NAVIGATION CLASSIQUE (Hors Reset Password)
    if (!session) {
      // Cas : Utilisateur non connecté
      if (!inAuthGroup) {
        if (__DEV__) console.log("[Nav] Redirection: Welcome");
        router.replace("/(auth)/welcome");
      }
    } else {
      // Cas : Utilisateur connecté
      if (!profileCompleted && !inOnboarding) {
        // Profil incomplet -> Onboarding
        if (__DEV__) console.log("[Nav] Redirection: Onboarding");
        router.replace("/(auth)/onboarding");
      } else if (profileCompleted && (inAuthGroup || inOnboarding)) {
        // Profil complet mais encore dans l'auth/onboarding -> Home
        if (__DEV__) console.log("[Nav] Redirection: Home");
        router.replace("/(tabs)/home");
      }
    }

    SplashScreen.hideAsync();
  }, [session, profileCompleted, segments, fontsLoaded, loading, isRecovering]);

  // D. RENDU
  // On ne bloque pas le rendu si on est en isRecovering (pour afficher la page de reset immédiatement)
  if (!fontsLoaded || (loading && !isRecovering)) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* On définit explicitement les groupes pour éviter les erreurs de route */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
