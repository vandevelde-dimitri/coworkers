import { StyleSheet, Text, View } from "react-native";

export default function AddScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Creation annonce</Text>
            <Text style={styles.subtitle}>Écran de création</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
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
