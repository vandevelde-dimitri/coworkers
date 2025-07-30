import { formAuthStyles } from "@/styles/form.styles";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert("Erreur", error.message);
        } else {
            // ✅ Lire la route d'origine (si elle existe)
            const redirectTo = await SecureStore.getItemAsync("redirectTo");

            if (redirectTo) {
                await SecureStore.deleteItemAsync("redirectTo");
                router.replace(redirectTo as any); // Type assertion for dynamic routes
            } else {
                router.replace("/(tabs)");
            }
        }
    };

    return (
        <View style={formAuthStyles.container}>
            <Text style={formAuthStyles.title}>Connexion</Text>

            <TextInput
                style={formAuthStyles.input}
                placeholder="Adresse e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={formAuthStyles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button title="Se connecter" onPress={handleLogin} />
        </View>
    );
};

export default LoginScreen;
