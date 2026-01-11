import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as yup from "yup";
import { supabase } from "../../../utils/supabase";

export default function LoginScreen() {
    const navigation = useNavigation();
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
            return;
        }

        // Login réussi → récupérer la redirection
        const redirectStr = await SecureStore.getItemAsync("redirectTo");
        if (redirectStr) {
            const redirect = JSON.parse(redirectStr);

            navigation.navigate(
                "AppTabs" as never,
                {
                    screen: redirect.stack || "HomeStack",
                    params: {
                        screen: redirect.name,
                        params: redirect.params,
                    },
                } as never
            );

            await SecureStore.deleteItemAsync("redirectTo");
        } else {
            navigation.navigate("AppTabs"); // par défaut
        }
    };
    return (
        <ScrollView
            style={{ flex: 1, padding: 16, backgroundColor: "#f3f4f6" }}
        >
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "700",
                    marginBottom: 32,
                    textAlign: "center",
                }}
            >
                Se connecter
            </Text>

            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 18,
                    padding: 16,
                    marginBottom: 24,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                }}
            >
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Email"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            keyboardType="email-address"
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: "#e5e7eb",
                                marginBottom: 16,
                                fontSize: 16,
                                paddingVertical: 8,
                            }}
                        />
                    )}
                />
                {errors.email && <Text>{errors.email.message}</Text>}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Mot de passe"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            secureTextEntry
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: "#e5e7eb",
                                marginBottom: 16,
                                fontSize: 16,
                                paddingVertical: 8,
                            }}
                        />
                    )}
                />
                {errors.password && <Text>{errors.password.message}</Text>}

                <TouchableOpacity
                    onPress={handleSubmit(handleLogin)}
                    style={{
                        backgroundColor: "#2563eb",
                        paddingVertical: 14,
                        borderRadius: 18,
                        alignItems: "center",
                        marginTop: 8,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        Se connecter
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginTop: 16, alignItems: "center" }}
                >
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                        Créer un compte
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(
                            "Mot de passe oublié",
                            "Fonctionnalité à implémenter"
                        )
                    }
                    style={{ marginTop: 8, alignItems: "center" }}
                >
                    <Text style={{ color: "#6b7280" }}>
                        Mot de passe oublié ?
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
