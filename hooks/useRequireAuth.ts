import { useAuth } from "@/hooks/authContext";
import { useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export function useRequireAuth() {
    const { session, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !session) {
            const currentPath = "/" + segments.join("/");
            SecureStore.setItemAsync("redirectTo", currentPath);
            router.replace("/signin");
        }
    }, [loading, session, segments, router]);
}
