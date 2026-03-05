import { Stack } from "expo-router";

export default function AccountStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="candidate" />
      <Stack.Screen name="favorite" />
      <Stack.Screen name="updateAvatar" />
    </Stack>
  );
}
