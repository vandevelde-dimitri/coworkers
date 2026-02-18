import { GetConversationsUseCase } from "@/src/application/use-case/chat/GetConversation";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/SupabaseChatRepository";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../authContext";

const chatRepo = new SupabaseChatRepository();
const getConversationsUseCase = new GetConversationsUseCase(chatRepo);

export const useGetConversations = () => {
    const { session } = useAuth();
    const userId = session?.user?.id;

    return useQuery({
        queryKey: ["conversations", userId],
        queryFn: async () => {
            if (!userId) return [];
            return await getConversationsUseCase.execute(userId);
        },
        enabled: !!userId,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60,
    });
};
