import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/AppNavigator";
import { AuthProvider } from "./src/contexts/authContext";
import { MessageProvider } from "./src/contexts/messageContext";
import { toastConfig } from "./src/components/ui/ToastConfig";

const Tab = createBottomTabNavigator();
export default function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <MessageProvider>
                    <StatusBar style="auto" />
                    <AppNavigator />
                </MessageProvider>
                <Toast config={toastConfig} />
            </AuthProvider>
        </QueryClientProvider>
    );
}
