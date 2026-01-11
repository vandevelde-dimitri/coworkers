import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { PublicStackParamList } from "../navigation/PublicStack";

type WelcomeScreenNavigationProp =
    NativeStackNavigationProp<PublicStackParamList>;

export default function WelcomeScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#f3f4f6" }}
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 16,
            }}
        >
            {/* Logo */}
            <View style={{ marginBottom: 32, alignItems: "center" }}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={{ width: 180, height: 180, marginBottom: 16 }}
                    resizeMode="contain"
                />
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: "700",
                        color: "#2563eb",
                    }}
                >
                    Coworkers
                </Text>
                <Text
                    style={{
                        color: "#6b7280",
                        fontSize: 16,
                        marginTop: 4,
                        textAlign: "center",
                    }}
                >
                    Trouvez un covoiturage facilement entre collègues Amazon
                    France
                </Text>
            </View>

            {/* Boutons */}
            <View style={{ width: "100%" }}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Auth", { screen: "Register" })
                    }
                    style={{
                        backgroundColor: "#2563eb",
                        paddingVertical: 16,
                        borderRadius: 18,
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        Commencer
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Auth", { screen: "Login" })
                    }
                    style={{
                        paddingVertical: 16,
                        borderRadius: 18,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#2563eb",
                    }}
                >
                    <Text
                        style={{
                            color: "#2563eb",
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        Se connecter
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("AppTabs")}
                    style={{
                        paddingVertical: 16,
                        borderRadius: 18,
                        alignItems: "center",
                        marginTop: 12,
                    }}
                >
                    <Text
                        style={{
                            color: "#6b7280",
                            fontWeight: "600",
                            fontSize: 14,
                        }}
                    >
                        Continuer sans compte
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
