import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider, useAuth } from "@/src/presentation/hooks/authContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
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
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { session, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (session) {
                router.replace("/(tabs)");
            } else {
                router.replace("/(auth)/welcome");
            }
        }
    }, [session, loading]);
    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </ThemeProvider>
    );
}
