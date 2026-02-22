import { Stack } from "expo-router";

export default function AccountStackLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="edit" />
            <Stack.Screen name="settings" />
        </Stack>
    );
}
