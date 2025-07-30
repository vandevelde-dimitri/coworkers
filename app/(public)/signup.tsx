import { formAuthStyles } from "@/styles/form.styles";
import { supabase } from "@/utils/supabase";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

const SignupScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert("Erreur", error.message);
        } else {
            Alert.alert(
                "Inscription réussie",
                "Vérifie tes mails pour confirmer ton compte"
            );
        }
    };

    return (
        <View style={formAuthStyles.container}>
            <Text style={formAuthStyles.title}>Inscription</Text>

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

            <Button title="S'inscrire" onPress={handleSignup} />
        </View>
    );
};

export default SignupScreen;
