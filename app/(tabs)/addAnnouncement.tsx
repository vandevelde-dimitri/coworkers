import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/authContext";
import { supabase } from "@/utils/supabase";
import { Button, StyleSheet } from "react-native";

export default function AddAnnouncementScreen() {
    // Fetch the current session
    const { session } = useAuth();
    const handleClick = async () => {
        // Handle logout or any other action
        const { error } = await supabase.auth.signOut();
    };

    console.log("AddAnnouncementScreen session:", session);

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Explore</ThemedText>
            <ThemedText style={styles.text}>
                This is the Explore tab. You can customize this screen to
                display features, news, or any other content you want to
                highlight in your app.
            </ThemedText>
            <Button title="Déconnexion" onPress={handleClick} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        gap: 12,
    },
    text: {
        fontSize: 16,
    },
});
