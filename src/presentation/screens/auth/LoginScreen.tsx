import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FormInput } from "../../components/ui/FormInput";
import { StackHeader } from "../../components/ui/Header";

export default function LoginScreen() {
    const router = useRouter();

    const schema = yup.object({
        email: yup.string().email("Email invalide").required("Email requis"),
        password: yup.string().required("Mot de passe requis"),
    });
    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });

    const handleLogin = async (data: { email: string; password: string }) => {
        const { email, password } = data;

        console.log(data);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <StackHeader title="Connexion" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.welcomeTitle}>
                            Ravi de vous revoir !
                        </Text>
                        <Text style={styles.welcomeSubtitle}>
                            Connectez-vous pour retrouver vos trajets.
                        </Text>
                    </View>

                    <FormInput
                        control={control}
                        name="email"
                        label="Email"
                        type="email"
                        iconName="mail-outline"
                        placeholder="john@doe.fr"
                    />

                    <FormInput
                        control={control}
                        name="password"
                        type="password"
                        label="Mot de passe"
                        iconName="lock-closed-outline"
                        placeholder="••••••••"
                    />

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleSubmit(handleLogin)}
                    >
                        <Text style={styles.loginButtonText}>Se connecter</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Pas encore de compte ?{" "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(auth)/register")}
                        >
                            <Text style={styles.linkText}>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#141E30" },
    scrollContent: { padding: 25, paddingTop: 40 },
    headerTextContainer: { marginBottom: 40 },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFF",
        marginBottom: 10,
    },
    welcomeSubtitle: { fontSize: 16, color: "#B9B9B9" },
    loginButton: {
        backgroundColor: "#FFF",
        height: 60,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        elevation: 4,
    },
    loginButtonText: { color: "#141E30", fontSize: 18, fontWeight: "700" },
    footer: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
    footerText: { color: "#B9B9B9", fontSize: 15 },
    linkText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "700",
        textDecorationLine: "underline",
    },
});
