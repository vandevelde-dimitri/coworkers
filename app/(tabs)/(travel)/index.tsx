import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TravelScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Écran de voyage</Text>
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
    },
});

export default TravelScreen;
