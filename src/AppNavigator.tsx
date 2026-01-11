import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./contexts/authContext";
import AppTabs from "./navigation/AppTabs";
import PublicStack from "./navigation/PublicStack";
import OnboardingScreen from "./screens/auth/OnboardingScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { session, loading, profileCompleted } = useAuth();

    if (loading) return null; // splash screen si tu veux

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* 🔓 Utilisateur NON connecté - Écran d'accueil */}
                {!session && (
                    <>
                        <Stack.Screen name="Public" component={PublicStack} />
                        <Stack.Screen name="AppTabs" component={AppTabs} />
                        {/* <Stack.Screen name="Auth" component={AuthStack} /> */}
                    </>
                )}

                {/* 🧩 Connecté mais profil incomplet */}
                {session && !profileCompleted && (
                    <Stack.Screen
                        name="Onboarding"
                        component={OnboardingScreen}
                    />
                )}

                {/* 🔐 Utilisateur connecté */}
                {session && profileCompleted && (
                    <Stack.Screen name="AppTabs" component={AppTabs} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
