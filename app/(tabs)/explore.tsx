import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";

export default function ExploreScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Explore</ThemedText>
            <ThemedText style={styles.text}>
                This is the Explore tab. You can customize this screen to
                display features, news, or any other content you want to
                highlight in your app.
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
