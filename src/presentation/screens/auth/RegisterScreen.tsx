import { Register } from "@/src/domain/entities/auth/Register";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useForm } from "react-hook-form";
import {
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as yup from "yup";
import { FormInput } from "../../components/ui/FormInput";
import { StackHeader } from "../../components/ui/Header";
import { useRegister } from "../../hooks/mutations/useRegister";

export default function RegisterScreen() {
    const router = useRouter();
    const { mutate: register, isPending } = useRegister();
    const schema = yup.object({
        email: yup.string().email("Email invalide").required("Email requis"),
        password: yup.string().required("Mot de passe requis"),
        confirmPassword: yup
            .string()
            .oneOf(
                [yup.ref("password")],
                "Les mots de passe ne correspondent pas",
            )
            .required("Confirmation requise"),
    });
    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: Register) => {
        register(data);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <StackHeader title="Inscription" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.welcomeTitle}>
                        Rejoignez l'aventure
                    </Text>
                    <Text style={styles.welcomeSubtitle}>
                        Créez votre compte Coworkers en 1 minute.
                    </Text>

                    <View style={{ marginTop: 30 }}>
                        <FormInput
                            iconName="mail-outline"
                            control={control}
                            name="email"
                            label="Email"
                            placeholder="john@doe.fr"
                            type="email"
                        />
                        <FormInput
                            iconName="lock-closed-outline"
                            control={control}
                            name="password"
                            label="Mot de passe"
                            placeholder="*******"
                            type="password"
                        />
                        <FormInput
                            iconName="lock-closed-outline"
                            control={control}
                            name="confirmPassword"
                            label="Confirmer le mot de passe"
                            placeholder="*******"
                            type="password"
                        />
                    </View>
                    <View style={styles.termsContainer}>
                        <Text style={styles.footerText}>
                            En vous inscrivant, vous acceptez nos{" "}
                            <Text
                                style={styles.linkText}
                                onPress={() =>
                                    Linking.openURL(
                                        "https://coworkers-legal.vercel.app/",
                                    )
                                }
                            >
                                Mentions Légales
                            </Text>{" "}
                            et notre{" "}
                            <Text
                                style={styles.linkText}
                                onPress={() =>
                                    Linking.openURL(
                                        "https://coworkers-legal.vercel.app/politique_confidentialite",
                                    )
                                }
                            >
                                Politique de Confidentialité
                            </Text>
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.registerButton,
                            isPending && { opacity: 0.7 },
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isPending}
                    >
                        <Text style={styles.registerButtonText}>
                            {isPending ? "Inscription..." : "S'inscrire"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/(auth)/login")}
                        style={styles.backLink}
                    >
                        <Text style={styles.footerText}>
                            Déjà inscrit ?{" "}
                            <Text style={styles.linkText}>Connexion</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#141E30" },
    scrollContent: { padding: 25, paddingTop: 40 },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFF",
        marginBottom: 10,
    },
    welcomeSubtitle: { fontSize: 16, color: "#B9B9B9" },
    registerButton: {
        backgroundColor: "#FFF",
        height: 60,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    registerButtonText: { color: "#141E30", fontSize: 18, fontWeight: "700" },
    backLink: { marginTop: 30, alignItems: "center" },
    footerText: { color: "#B9B9B9", fontSize: 15 },
    linkText: { color: "#FFF", fontWeight: "700" },
    termsContainer: {
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    termsBottom: {
        marginTop: 40,
        fontSize: 12,
        opacity: 0.6,
        textAlign: "center",
    },
});
