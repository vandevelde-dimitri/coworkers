import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { useAuth } from "../contexts/authContext";

export function useRequireAuth(stackName: string = "HomeStack") {
    const { session, loading } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        if (!loading && !session) {
            const redirect = {
                stack: stackName,
                name: route.name,
                params: route.params,
            };

            SecureStore.setItemAsync("redirectTo", JSON.stringify(redirect));

            // Redirige vers le Login
            navigation.navigate("PublicStack" as never);
        }
    }, [loading, session, route, navigation, stackName]);
}
