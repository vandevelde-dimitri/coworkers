// Exemple : src/screens/home/HomeScreen.tsx
import React from "react";
import { Button, Text, View } from "react-native";

export default function ForgotPwdScreen({ navigation }) {
    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Text>Page d'accueil</Text>
            <Button
                title="Voir une annonce"
                onPress={() => navigation.navigate("AnnouncementDetail")}
            />
        </View>
    );
}
