import UserScreen from "@/src/presentation/screens/Profile/UserScreen";
import { Stack, useLocalSearchParams } from "expo-router";

export default function UserDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Détails du profil",
          headerBackTitle: "Retour",
          headerTintColor: "#141E30",
        }}
      />

      <UserScreen userId={id} />
    </>
  );
}
