import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text>Bienvenue sur notre app !</Text>
            <Text>Découvrez les fonctionnalités ou connectez-vous</Text>

            <Button
                title="Se connecter"
                onPress={() => router.push("/signin")}
            />
            <Button
                title="Explorer en invité"
                onPress={() => {
                    /* mode démo si dispo */
                }}
            />
        </View>
    );
}
