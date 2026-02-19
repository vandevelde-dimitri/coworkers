import { SendMessage } from "@/src/application/use-case/chat/SendMessage";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/SupabaseChatRepository";
import { useMutation } from "@tanstack/react-query";

const chatRepo = new SupabaseChatRepository();
const sendMessageUseCase = new SendMessage(chatRepo);

export const useSendMessage = (conversationId: string) => {
    return useMutation({
        mutationFn: ({ content }: { userId: string; content: string }) =>
            sendMessageUseCase.execute(conversationId, content),

        onError: (error) => {
            if (__DEV__)
                console.error("Erreur lors de l'envoi du message :", error);
        },
    });
};
