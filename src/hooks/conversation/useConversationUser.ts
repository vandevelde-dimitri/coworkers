import { useQuery } from "@tanstack/react-query";
import { getUserConversationsPreview } from "../../api/user/getUserConversations";
import { useAuth } from "../../contexts/authContext";

export function useUserConversations() {
    const { session } = useAuth();

    return useQuery({
        queryKey: ["user-conversations", session?.user.id],
        queryFn: getUserConversationsPreview.bind(null, session?.user.id!),
        enabled: !!session?.user.id,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
}
