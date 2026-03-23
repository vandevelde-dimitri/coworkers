import { ToastProviderWithViewport } from "@/src/presentation/components/ui/molecules/Toast";
import { NetworkBanner } from "@/src/presentation/components/ui/NetworkBanner";
import { useColorScheme } from "@/src/presentation/components/useColorScheme.web";
import { AuthProvider, useAuth } from "@/src/presentation/hooks/authContext";
import { MessageProvider } from "@/src/presentation/hooks/context/messageContext";
import { NotificationProvider } from "@/src/presentation/hooks/context/notificationContext";
import { getIsRecoveryFlow } from "@/src/presentation/hooks/deepLinkFlag";
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
import * as Linking from "expo-linking";
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
  const { session, loading, profileCompleted } = useAuth();
  const isRecoveryFlow = getIsRecoveryFlow();
  const router = useRouter();
  const segments = useSegments() as string[];
  const colorScheme = useColorScheme();
  const url = Linking.useURL();

  const [fontsLoaded] = Font.useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useSupabaseDeepLink();

  useEffect(() => {
    if (loading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments.includes("onboarding");
    const isOnResetPage = segments.includes("reset-password");

    if (isRecoveryFlow || isOnResetPage) {
      SplashScreen.hideAsync();
      return;
    }

    if (!session) {
      if (!inAuthGroup) {
        if (__DEV__) console.log("[Nav] Redirection: Welcome");
        router.replace("/(auth)/welcome");
      }
    } else {
      if (!profileCompleted && !inOnboarding) {
        if (__DEV__) console.log("[Nav] Redirection: Onboarding");
        router.replace("/(auth)/onboarding");
      } else if (profileCompleted && (inAuthGroup || inOnboarding)) {
        if (__DEV__) console.log("[Nav] Redirection: Home");
        router.replace("/(tabs)/home");
      }
    }

    SplashScreen.hideAsync();
  }, [
    session,
    profileCompleted,
    segments,
    fontsLoaded,
    loading,
    url,
    isRecoveryFlow,
  ]);

  if (!fontsLoaded || loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="user/[id]"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
