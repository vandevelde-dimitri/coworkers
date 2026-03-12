import { ToastProviderWithViewport } from "@/src/presentation/components/ui/molecules/Toast";
import { useColorScheme } from "@/src/presentation/components/useColorScheme.web";
import { AuthProvider, useAuth } from "@/src/presentation/hooks/authContext";
import { MessageProvider } from "@/src/presentation/hooks/context/messageContext";
import { NotificationProvider } from "@/src/presentation/hooks/context/notificationContext";
import { queryClient } from "@/utils/react-query";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(auth)/welcome",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProviderWithViewport>
        <AuthProvider>
          <NotificationProvider>
            <MessageProvider>
              <RootLayoutNav />
            </MessageProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProviderWithViewport>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const { session, loading, profileCompleted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";

    if (!session) {
      if (!inAuthGroup) {
        router.replace("/(auth)/welcome");
      }
    } else {
      if (!profileCompleted && !inOnboarding) {
        router.replace("/onboarding");
      } else if (profileCompleted && (inAuthGroup || inOnboarding)) {
        router.replace("/(tabs)/home");
      }
    }
  }, [session, profileCompleted, loading, segments]);
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
