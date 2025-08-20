import React from "react";
import { StyleSheet, Text, View } from "react-native";

const AccountScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Écran Protégé</Text>
            <Text style={styles.subtitle}>
                Vous êtes sur un écran protégé par l'authentification.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
    },
});

export default AccountScreen;
