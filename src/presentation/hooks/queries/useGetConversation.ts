import { GetConversationsUseCase } from "@/src/application/use-case/chat/GetConversation";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/SupabaseChatRepository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "../authContext";

export const useGetConversations = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const getConversationsUseCase = useMemo(() => {
    const chatRepo = SupabaseChatRepository.getInstance();
    return new GetConversationsUseCase(chatRepo);
  }, []);

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
