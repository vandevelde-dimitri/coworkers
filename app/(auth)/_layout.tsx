import { useColorScheme } from "@/src/presentation/components/useColorScheme.web";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";

export default function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="welcome" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="onboarding" />
            </Stack>
        </ThemeProvider>
    );
}
