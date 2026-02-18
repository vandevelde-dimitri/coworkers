import ChatScreen from "@/src/presentation/screens/messaging/ChatScreen";
import { useLocalSearchParams } from "expo-router";

export default function ChatPage() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return <ChatScreen conversationId={id} />;
}
