import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import { AuthStackParamList } from "../types/navigation/authStackType";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
    const navigation = useNavigation();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: "Connexion" }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: "Inscription" }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ title: "Mot de passe oublié" }}
            />
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ title: "Onboarding" }}
            />
        </Stack.Navigator>
    );
}
