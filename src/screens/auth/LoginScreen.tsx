import { yupResolver } from "@hookform/resolvers/yup";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { supabase } from "../../../utils/supabase";
import SafeScreen from "../../components/SafeScreen";
import { formAuthStyles } from "../../styles/form.styles";

const LoginScreen = () => {
    const schema = yup.object({
        email: yup.string().email("Email invalide").required("Email requis"),
        password: yup.string().required("Mot de passe requis"),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const handleLogin = async (data: { email: string; password: string }) => {
        const { email, password } = data;
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
                // router.replace(redirectTo as any); // Type assertion for dynamic routes
            } else {
                // router.replace("/(tabs)/(home)");
            }
        }
    };

    return (
        <SafeScreen backBtn>
            <View style={formAuthStyles.container}>
                <Text style={formAuthStyles.title}>Se connecter</Text>
                <View style={formAuthStyles.form}>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                keyboardType="email-address"
                                onChangeText={onChange}
                                placeholder="john@example.com"
                                placeholderTextColor="#6b7280"
                                style={formAuthStyles.input}
                                value={value}
                                onBlur={onBlur}
                            />
                        )}
                    />
                    {errors.email && (
                        <Text style={formAuthStyles.error}>
                            {errors.email.message}
                        </Text>
                    )}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                placeholder="********"
                                placeholderTextColor="#6b7280"
                                style={formAuthStyles.input}
                                secureTextEntry={true}
                            />
                        )}
                    />
                    {errors.password && (
                        <Text style={formAuthStyles.error}>
                            {errors.password.message}
                        </Text>
                    )}
                    <TouchableOpacity
                        onPress={handleSubmit(handleLogin)}
                        style={formAuthStyles.buttonPrimary}
                    >
                        <Text style={formAuthStyles.buttonText}>Connexion</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    // onPress={() => router.push("/(public)/register")}
                    >
                        <Text style={formAuthStyles.link}>
                            Pas encore de compte ? S'inscrire
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
};

export default LoginScreen;
