import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "./contexts/authContext"; // 👈 ton hook
import AppTabs from "./navigation/AppTabs";
import AuthStack from "./navigation/AuthStack";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { session, loading, profileCompleted } = useAuth();

    if (loading) return null; // tu peux aussi mettre un splash screen

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!session ? (
                    <Stack.Screen name="Auth" component={AuthStack} />
                ) : !profileCompleted ? (
                    // si tu veux gérer un onboarding ou profil incomplet
                    <Stack.Screen
                        name="Onboarding"
                        component={AppTabs} // ou ton propre écran d'onboarding
                    />
                ) : (
                    <Stack.Screen name="AppTabs" component={AppTabs} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
