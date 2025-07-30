// app/_layout.tsx
import { AuthProvider, useAuth } from "@/hooks/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

function InitialLayout() {
    const { session, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    const inAuthGroup = segments[0] === "(public)";
    const inTabsGroup = segments[0] === "(tabs)";

    useEffect(() => {
        if (!loading) {
            // Si pas de session ET (dans tabs OU pas dans auth)
            if (!session && (inTabsGroup || !inAuthGroup)) {
                router.replace("/welcome");
                return;
            }

            // Si session ET dans auth
            if (session && inAuthGroup) {
                router.replace("/(tabs)");
                return;
            }
        }
    }, [session, loading, segments]);

    if (loading) return null;

    return <Slot />;
}

export default function RootLayout() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <InitialLayout />
            </AuthProvider>
        </QueryClientProvider>
    );
}
