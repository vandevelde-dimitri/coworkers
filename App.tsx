import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/AppNavigator";
import { toastConfig } from "./src/components/ui/ToastConfig";
import { AuthProvider } from "./src/contexts/authContext";
import { MessageProvider } from "./src/contexts/messageContext";
import { NotificationProvider } from "./src/contexts/notificationContext";
import { queryClient } from "./utils/react-query";

export default function App() {
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
