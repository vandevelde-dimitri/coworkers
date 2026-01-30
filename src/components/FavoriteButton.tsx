import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/authContext";
import { useFavorite } from "../hooks/favortie/useFavorite";

export default function FavoriteButton({ annonceId }: { annonceId: string }) {
    const navigation = useNavigation();
    const { session } = useAuth();

    const { isFavorite, toggleFavorite } = useFavorite(
        session?.user.id,
        annonceId,
    );

    const onPress = async () => {
        if (!session) {
            await SecureStore.setItemAsync(
                "redirectTo",
                JSON.stringify({
                    screen: "AnnonceDetail",
                    params: { id: annonceId },
                }),
            );

            navigation.navigate("PublicStack" as never);
            return;
        }

        await toggleFavorite(!isFavorite);
    };

    return (
        <TouchableOpacity
            style={{
                backgroundColor: "#2563eb",
                padding: 16,
                borderRadius: 16,
                marginBottom: 10,
            }}
            onPress={onPress}
        >
            <Text
                style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "600",
                }}
            >
                {isFavorite ? "Retirer" : "Ajouter"} favoris
            </Text>
        </TouchableOpacity>
    );
}
