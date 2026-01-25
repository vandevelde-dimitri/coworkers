import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useAuth } from "./contexts/authContext";
import AppTabs from "./navigation/AppTabs";
import AuthStack from "./navigation/AuthStack";
import { navigate, navigationRef } from "./navigation/RootNavigation";
import OnboardingScreen from "./screens/auth/OnboardingScreen";
import UpdatePasswordScreen from "./screens/auth/UpdatePasswordScreen";
import WelcomeScreen from "./screens/welcome";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { session, loading, profileCompleted } = useAuth();

    useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            console.log("Lien reçu dans app navigator :", event.url);

            const normalizedUrl = event.url.replace("#", "?");
            const parsed = Linking.parse(normalizedUrl);

            // On extrait l'access_token du fragment ou des queryParams
            const accessToken = parsed.queryParams?.access_token;
            const refreshToken = parsed.queryParams?.refresh_token;

            if (
                normalizedUrl.includes("type=recovery") ||
                parsed.path === "reset-password"
            ) {
                console.log(
                    "🚀 Redirection vers UpdatePassword avec les tokens...",
                );

                // ON PASSE LES PARAMS ICI 👇
                navigate("UpdatePassword", {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });
            }
        };

        const subscription = Linking.addEventListener("url", handleDeepLink);
        return () => subscription.remove();
    }, []);

    if (loading) return <ActivityIndicator />; // splash screen si tu veux

    // Si connecté mais profil non complété → Onboarding obligatoire
    if (session && !profileCompleted) {
        return (
            <NavigationContainer
                ref={navigationRef}
                onReady={() => console.log("Navigation prête !")}
            >
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name="Onboarding"
                        component={OnboardingScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    // Sinon : app accessible à tous (connecté ou non)
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => console.log("Navigation prête !")}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Welcome comme premier écran */}
                <Stack.Screen name="Welcome" component={WelcomeScreen} />

                {/* AppTabs accessible à tous */}
                <Stack.Screen name="AppTabs" component={AppTabs} />

                {/* Auth pour login/register */}
                <Stack.Screen name="Auth" component={AuthStack} />

                {/* Reset password */}
                <Stack.Screen
                    name="UpdatePassword"
                    component={UpdatePasswordScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
