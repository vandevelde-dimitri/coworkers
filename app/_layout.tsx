import { AuthProvider, useAuth } from "@/hooks/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

function InitialLayout() {
    const { session, loading, profileCompleted } = useAuth(); // <-- ajoute profileCompleted
    const segments = useSegments();
    const router = useRouter();

    const inPublicGroup = segments[0] === "(public)";
    const inTabsGroup = segments[0] === "(tabs)";
    const inRegisterGroup = segments[0] === "(protected)"; // tes étapes d’onboarding

    useEffect(() => {
        if (!loading) {
            // 🔴 Cas 1 : pas connecté
            if (!session && (inTabsGroup || !inPublicGroup)) {
                router.replace("/welcome");
                return;
            }

            // 🟠 Cas 2 : connecté mais profil incomplet
            if (session && !profileCompleted && !inRegisterGroup) {
                router.replace("/(protected)/register/username");
                return;
            }

            // 🟢 Cas 3 : connecté avec profil complet → empêche retour vers (public)
            if (session && profileCompleted && inPublicGroup) {
                router.replace("/(tabs)");
                return;
            }
        }
    }, [session, loading, segments, profileCompleted]);

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
