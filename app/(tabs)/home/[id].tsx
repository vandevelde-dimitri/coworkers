import AnnouncementDetailScreen from "@/src/presentation/screens/announcement/AnnouncementDetailScreen";
import { Stack, useLocalSearchParams } from "expo-router";

export default function AnnouncementDetailsPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Détails du trajet",
                    headerBackTitle: "Retour",
                    headerTintColor: "#141E30",
                }}
            />

            <AnnouncementDetailScreen announcementId={id} />
        </>
    );
}
