import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/AppNavigator";
import { AuthProvider } from "./src/contexts/authContext"; // ton fichier
import { MessageProvider } from "./src/contexts/messageContext";

export default function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <MessageProvider>
                    <StatusBar style="auto" />
                    <AppNavigator />
                </MessageProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
