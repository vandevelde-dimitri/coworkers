import { useQuery } from "@tanstack/react-query";
import { getUserConversationsPreview } from "../../api/user/getUserConversations";
import { useAuth } from "../../contexts/authContext";

export function useUserConversations() {
    const { session } = useAuth();
    const userId = session?.user?.id;

    return useQuery({
        queryKey: ["user-conversations", userId],
        queryFn: () => getUserConversationsPreview(userId!),
        enabled: !!userId,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
}
