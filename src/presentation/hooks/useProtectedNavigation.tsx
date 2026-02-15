import { ExternalPathString, RelativePathString, useRouter } from "expo-router";
import { useAuth } from "./authContext";

export const useProtectedNavigation = () => {
    const router = useRouter();
    const { session } = useAuth();
    const isLoggedIn = !!session;

    const navigateSafely = (path: RelativePathString | ExternalPathString) => {
        if (!isLoggedIn) {
            router.push("/(auth)/welcome");
        } else {
            router.push(path);
        }
    };

    return { navigateSafely };
};
