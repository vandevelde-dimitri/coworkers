import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function HomeScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Welcome to your new app! 🎉</ThemedText>
            <ThemedText style={styles.text}>
                You're now authenticated. This is the home screen of your
                starter app using Expo + Supabase.
            </ThemedText>
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
