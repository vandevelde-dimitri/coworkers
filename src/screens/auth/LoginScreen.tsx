import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { showToast } from "../../../utils/showToast";
import { supabase } from "../../../utils/supabase";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { FormInput } from "../../components/ui/FormInput";
import { AuthStackParamList } from "../../types/navigation/authStackType";

type WelcomeScreenNavigationProp =
    NativeStackNavigationProp<AuthStackParamList>;

export default function LoginScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const schema = yup.object({
        email: yup.string().email("Email invalide").required("Email requis"),
        password: yup.string().required("Mot de passe requis"),
    });
    const { control, handleSubmit } = useForm({
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

        showToast("success", "Connexion réussie !");
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
                } as never,
            );

            await SecureStore.deleteItemAsync("redirectTo");
        } else {
            navigation.navigate("AppTabs"); // par défaut
        }
    };

    const handleForgotPassword = async (email: string) => {
        const resetUrl = Linking.createURL("reset-password");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: resetUrl,
        });

        if (error) {
            showToast("error", "Erreur : " + error.message);
        } else {
            showToast("success", "Lien de réinitialisation envoyé !");
        }
    };

    return (
        <ScreenWrapper back>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 16,
                }}
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
                        width: "100%",
                        maxWidth: 400,
                    }}
                >
                    <FormInput
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="john@doe.fr"
                        type="email"
                    />

                    <FormInput
                        control={control}
                        name="password"
                        label="Mot de passe"
                        placeholder="*******"
                        type="password"
                    />
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
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                            Créer un compte
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("ForgotPassword")}
                        style={{ marginTop: 8, alignItems: "center" }}
                    >
                        <Text style={{ color: "#6b7280" }}>
                            Mot de passe oublié ?
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
