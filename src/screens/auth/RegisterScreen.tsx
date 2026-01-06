import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as yup from "yup";
import { supabase } from "../../../utils/supabase";
import { formAuthStyles } from "../../styles/form.styles";
import { AuthStackParamList } from "../../types/navigation/authStackType";

type WelcomeScreenNavigationProp =
    NativeStackNavigationProp<AuthStackParamList>;

export default function RegisterScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
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

    const onSubmit = async (data: { email: string; password: string }) => {
        const { email, password } = data;

        const { data: userAuth, error: errorAuth } = await supabase.auth.signUp(
            {
                email,
                password,
            }
        );

        if (errorAuth) {
            console.log("Erreur inscription:", errorAuth.message);
            return;
        }

        if (userAuth.user) {
            const { data: user, error: errorUser } = await supabase
                .from("users")
                .upsert(
                    [
                        {
                            id: userAuth.user.id,
                        },
                    ],
                    { onConflict: "id" }
                );

            if (errorUser) {
                console.log("Erreur création user table:", errorUser.message);
                return;
            }
        }

        navigation.navigate("Onboarding");
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
                Créer un compte
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
                {errors.password && (
                    <Text style={formAuthStyles.error}>
                        {errors.password.message}
                    </Text>
                )}
                {/* 🧾 Mentions légales / politique de confidentialité */}
                <Text
                    style={{
                        fontSize: 12,
                        color: "#6b7280",
                        textAlign: "center",
                        marginBottom: 12,
                    }}
                >
                    En vous inscrivant, vous acceptez nos{" "}
                    <Text
                        style={{
                            color: "#10B981",
                            textDecorationLine: "underline",
                        }}
                        onPress={() =>
                            Linking.openURL(
                                "https://tonlien.notion.site/Mentions-legales"
                            )
                        }
                    >
                        mentions légales
                    </Text>{" "}
                    et notre{" "}
                    <Text
                        style={{
                            color: "#10B981",
                            textDecorationLine: "underline",
                        }}
                        onPress={() =>
                            Linking.openURL(
                                "https://tonlien.notion.site/Politique-de-confidentialite"
                            )
                        }
                    >
                        politique de confidentialité
                    </Text>
                    .
                </Text>
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
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
                        S'inscrire
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginTop: 16, alignItems: "center" }}
                >
                    <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                        Déjà un compte ? Se connecter
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
