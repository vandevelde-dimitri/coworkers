import {
    CommonActions,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
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

            // Réinitialise la navigation pour éviter la page blanche au retour
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "PublicStack" }],
                }),
            );
        }
    }, [loading, session, route, navigation, stackName]);
}
