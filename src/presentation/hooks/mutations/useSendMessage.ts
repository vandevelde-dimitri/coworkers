import { SendMessage } from "@/src/application/use-case/chat/SendMessage";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/SupabaseChatRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const chatRepo = new SupabaseChatRepository();
const sendMessageUseCase = new SendMessage(chatRepo);

export const useSendMessage = (conversationId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ content }: { userId: string; content: string }) =>
            sendMessageUseCase.execute(conversationId, content),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["messages", conversationId],
            });
        },
    });
};
