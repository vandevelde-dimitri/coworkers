import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/AppNavigator";
import { AuthProvider } from "./src/contexts/authContext"; // ton fichier

export default function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <StatusBar style="auto" />
                <AppNavigator />
            </AuthProvider>
        </QueryClientProvider>
    );
}
