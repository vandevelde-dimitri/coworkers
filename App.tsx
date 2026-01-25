import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/AppNavigator";
import { toastConfig } from "./src/components/ui/ToastConfig";
import { AuthProvider } from "./src/contexts/authContext";
import { MessageProvider } from "./src/contexts/messageContext";
import { NotificationProvider } from "./src/contexts/notificationContext";

export default function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { staleTime: 1000 * 60 * 5 },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <NotificationProvider>
                    <MessageProvider>
                        <StatusBar style="auto" />
                        <AppNavigator />
                    </MessageProvider>
                </NotificationProvider>
                <Toast
                    config={toastConfig}
                    position="bottom"
                    bottomOffset={120}
                />
            </AuthProvider>
        </QueryClientProvider>
    );
}
