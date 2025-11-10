import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import WelcomeScreen from "../screens/welcome";
import { AuthStackParamList } from "../types/navigation/authStackType";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
    const navigation = useNavigation();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("HomeStack", {
                                    screen: "Home",
                                })
                            }
                        >
                            <Text style={{ fontSize: 18, color: "#10B981" }}>
                                ✕
                            </Text>
                        </TouchableOpacity>
                    ),
                    title: "",
                })}
            />
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
        </Stack.Navigator>
    );
}
