import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useAuth } from "./contexts/authContext";
import AppTabs from "./navigation/AppTabs";
import PublicStack from "./navigation/PublicStack";
import { navigate, navigationRef } from "./navigation/RootNavigation";
import OnboardingScreen from "./screens/auth/OnboardingScreen";
import UpdatePasswordScreen from "./screens/auth/UpdatePasswordScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { session, loading, profileCompleted } = useAuth();

    useEffect(() => {
        const handleDeepLink = (event: { url: string }) => {
            const normalizedUrl = event.url.replace("#", "?");
            const parsed = Linking.parse(normalizedUrl);

            const accessToken = parsed.queryParams?.access_token;
            const refreshToken = parsed.queryParams?.refresh_token;

            if (
                normalizedUrl.includes("type=recovery") ||
                parsed.path === "reset-password"
            ) {
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

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!session ? (
                    <>
                        <Stack.Screen
                            name="PublicStack"
                            component={PublicStack}
                        />
                        {/* <Stack.Screen name="Auth" component={AuthStack} /> */}
                        <Stack.Screen name="AppTabs" component={AppTabs} />
                    </>
                ) : !profileCompleted ? (
                    <Stack.Screen
                        name="Onboarding"
                        component={OnboardingScreen}
                    />
                ) : (
                    <Stack.Screen name="AppTabs" component={AppTabs} />
                )}
                <Stack.Screen
                    name="UpdatePassword"
                    component={UpdatePasswordScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
