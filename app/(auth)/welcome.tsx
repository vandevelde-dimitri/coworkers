import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.navigate("/(auth)/login")}
            >
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
                <Text style={styles.buttonTextSecondary}>S'inscrire</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => router.navigate("/(tabs)")}
            >
                <Text style={styles.buttonTextSecondary}>
                    Continuer en tant qu'invité
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 40,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    buttonSecondary: {
        backgroundColor: "#f0f0f0",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    buttonTextSecondary: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
