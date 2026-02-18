import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/SupabaseChatRepository";
import { SendMessage } from "@/src/application/use-cases/chat/SendMessage";

const chatRepo = new SupabaseChatRepository();
const sendMessageUseCase = new SendMessage(chatRepo);

export const useSendMessage = (conversationId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, content }: { userId: string, content: string }) =>
            sendMessageUseCase.execute(conversationId, userId, content),
        
        // Optionnel : On peut invalider ou mettre à jour le cache ici
        onSuccess: () => {
            // Cela force le rafraîchissement pour être sûr d'avoir le message avec son ID final de la DB
            queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
        },
    });
};
