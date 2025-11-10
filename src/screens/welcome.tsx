import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SafeScreen from "../components/SafeScreen";
import { AuthStackParamList } from "../types/navigation/authStackType";

type WelcomeScreenNavigationProp =
    NativeStackNavigationProp<AuthStackParamList>;

export default function WelcomeScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    return (
        <SafeScreen backBtn>
            <View style={styles.container}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Bienvenue sur Coworkers</Text>
                <Text style={styles.subtitle}>
                    Partage ta route, simplifie tes trajets.
                </Text>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonSecondary}
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.buttonTextSecondary}>
                            S'inscrire
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footer}>Version 1.0</Text>
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    logo: {
        width: 170,
        height: 170,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "400",
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 36,
    },
    actions: {
        width: "100%",
        gap: 12,
    },
    buttonPrimary: {
        backgroundColor: "#10B981",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonSecondary: {
        backgroundColor: "#F3F4F6",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    buttonTextSecondary: {
        color: "#111827",
        fontWeight: "600",
        fontSize: 16,
    },
    footer: {
        fontSize: 12,
        color: "#A1A1AA",
        marginTop: 40,
    },
});
