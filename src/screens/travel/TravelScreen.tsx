// Exemple : src/screens/home/HomeScreen.tsx
import React from "react";
import { View, Text, Button } from "react-native";

export default function TravelScreen({ navigation }) {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text>Page travel</Text>
        </View>
    );
}
