import { AuthProvider, useAuth } from "@/hooks/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";

function InitialLayout() {
    const { session, loading, profileCompleted } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    const inPublicGroup = segments[0] === "(public)";
    const inTabsGroup = segments[0] === "(tabs)";
    const inRegisterGroup = segments[0] === "(protected)";

    useEffect(() => {
        if (!loading) {
            if (!session && (inTabsGroup || !inPublicGroup)) {
                router.replace("/welcome");
                return;
            }

            if (session && !profileCompleted && !inRegisterGroup) {
                router.replace("/(protected)/register/username");
                return;
            }

            if (session && profileCompleted && inPublicGroup) {
                router.replace("/(tabs)/(home)");
                return;
            }

            if (session && profileCompleted && !inTabsGroup) {
                router.replace("/(tabs)/(home)");
            }
        }
    }, [session, loading, segments, profileCompleted]);

    // 🔹 Status bar & Navigation bar
    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync("black");
            NavigationBar.setButtonStyleAsync("light");
        }
    }, []);

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#020000ff" />
            <Slot />
        </>
    );
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
