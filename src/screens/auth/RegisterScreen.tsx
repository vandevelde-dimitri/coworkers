import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { useForm } from "react-hook-form";
import {
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as yup from "yup";
import { showToast } from "../../../utils/showToast";
import { supabase } from "../../../utils/supabase";
import Button from "../../components/ui/Button";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { FormInput } from "../../components/ui/FormInput";
import { AuthStackParamList } from "../../types/navigation/authStackType";

type WelcomeScreenNavigationProp =
    NativeStackNavigationProp<AuthStackParamList>;

export default function RegisterScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const schema = yup.object({
        email: yup.string().email("Email invalide").required("Email requis"),
        password: yup.string().required("Mot de passe requis"),
    });
    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        const { email, password } = data;

        const { data: userAuth, error: errorAuth } = await supabase.auth.signUp(
            {
                email,
                password,
            },
        );

        if (errorAuth) {
            showToast("error", "Inscription échouée : ");
            return;
        }

        // La navigation vers Onboarding est automatique via authContext
        // car session && !profileCompleted déclenche l'affichage d'Onboarding
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
                                color: "#2563eb",
                                textDecorationLine: "underline",
                            }}
                            onPress={() =>
                                Linking.openURL(
                                    "https://coworkers-legal.vercel.app/",
                                )
                            }
                        >
                            mentions légales
                        </Text>{" "}
                        et notre{" "}
                        <Text
                            style={{
                                color: "#2563eb",
                                textDecorationLine: "underline",
                            }}
                            onPress={() =>
                                Linking.openURL(
                                    "https://coworkers-legal.vercel.app/politique_confidentialite",
                                )
                            }
                        >
                            politique de confidentialité
                        </Text>
                        .
                    </Text>
                    <Button
                        label="S'inscrire"
                        onPress={handleSubmit(onSubmit)}
                    />
                    <TouchableOpacity
                        style={{ marginTop: 16, alignItems: "center" }}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                            Déjà un compte ? Se connecter
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
