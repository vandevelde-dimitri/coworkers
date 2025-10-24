// Exemple : src/screens/home/HomeScreen.tsx
import React from "react";
import { View, Text, Button } from "react-native";

export default function ChatScreen({ navigation }) {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text>Chat</Text>
        </View>
    );
}
