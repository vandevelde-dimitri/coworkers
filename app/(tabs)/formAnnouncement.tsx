import AnnouncementFormScreen from "@/src/presentation/screens/announcement/AnnouncementFormScreen";
import { useLocalSearchParams } from "expo-router";

export default function FormAnnouncementPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return <AnnouncementFormScreen announcementId={id} />;
}
