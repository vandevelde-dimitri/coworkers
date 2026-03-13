import { SendMessage } from "@/src/application/use-case/chat/SendMessage";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/SupabaseChatRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  const sendMessageUseCase = useMemo(() => {
    const chatRepo = SupabaseChatRepository.getInstance();
    return new SendMessage(chatRepo);
  }, []);

  return useMutation({
    mutationFn: ({ content }: { userId: string; content: string }) =>
      sendMessageUseCase.execute(conversationId, content),

    onError: (error) => {
      if (__DEV__) console.error("Erreur lors de l'envoi du message :", error);
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["conversations", variables.userId],
      });
    },
  });
};
