import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PublicScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Écran Public</Text>
        <Text style={styles.subtitle}>
            Vous êtes actuellement sur un écran public.
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: "#555",
    },
});

export default PublicScreen;
