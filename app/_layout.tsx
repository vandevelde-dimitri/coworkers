import { ToastProviderWithViewport } from "@/src/presentation/components/ui/molecules/Toast";
import { NetworkBanner } from "@/src/presentation/components/ui/NetworkBanner";
import { useColorScheme } from "@/src/presentation/components/useColorScheme.web";
import { AuthProvider, useAuth } from "@/src/presentation/hooks/authContext";
import { MessageProvider } from "@/src/presentation/hooks/context/messageContext";
import { NotificationProvider } from "@/src/presentation/hooks/context/notificationContext";
import { queryClient } from "@/utils/react-query";
import { FontAwesome } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Font from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

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
  const router = useRouter();
  const segments = useSegments() as string[];
  const colorScheme = useColorScheme();

  const [fontsLoaded] = Font.useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  if (Platform.OS === "android") {
    NavigationBar.setPositionAsync("absolute");
    NavigationBar.setBackgroundColorAsync("#00000000");
  }

  useEffect(() => {
    if (loading || !fontsLoaded) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments.includes("onboarding");

    if (!session) {
      if (!inAuthGroup) {
        router.replace("/(auth)/welcome");
      }
    } else {
      if (!profileCompleted && !inOnboarding) {
        router.replace("/(auth)/onboarding");
      } else if (profileCompleted && (inAuthGroup || inOnboarding)) {
        router.replace("/(tabs)/home");
      }
    }

    SplashScreen.hideAsync();
  }, [session, profileCompleted, segments, fontsLoaded, loading]);

  if (!fontsLoaded || loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
