import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ChatScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Écran de chat</Text>
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

export default ChatScreen;
