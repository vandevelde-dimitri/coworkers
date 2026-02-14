import { supabase } from "@/src/infrastructure/supabase";
import { AppButton } from "@/src/presentation/components/ui/AppButton";
import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Welcome to your profile</Text>
            <AppButton title="Déconnexion" variant="danger" onPress={logout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
});
