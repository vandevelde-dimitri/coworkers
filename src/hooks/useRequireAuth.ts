// hooks/useRequireAuth.ts
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { useAuth } from "../contexts/authContext";

export function useRequireAuth() {
    const { session, loading } = useAuth();
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        if (!loading && !session) {
            const redirect = {
                name: route.name,
                params: route.params,
            };

            SecureStore.setItemAsync("redirectTo", JSON.stringify(redirect));

            navigation.navigate("Auth" as never);
        }
    }, [loading, session, route, navigation]);
}
