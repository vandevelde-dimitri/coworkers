import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Linking, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { supabase } from "../../../utils/supabase";
import SafeScreen from "../../components/SafeScreen";
import { formAuthStyles } from "../../styles/form.styles";

const RegisterScreen = () => {
    const navigation = useNavigation<any>();
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

        // router.replace("/(protected)/register/username");
        navigation.navigate("OnboardingStack", {
            screen: "UsernameEditScreen",
        });
    };

    return (
        <SafeScreen backBtn>
            <View style={formAuthStyles.container}>
                <Text style={formAuthStyles.title}>S' inscrire</Text>
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
                        style={formAuthStyles.buttonPrimary}
                    >
                        <Text style={formAuthStyles.buttonText}>
                            Inscription
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={formAuthStyles.link}>
                            Déjà un compte ? se connecter
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
};

export default RegisterScreen;
