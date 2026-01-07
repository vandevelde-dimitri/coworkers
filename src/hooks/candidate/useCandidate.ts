import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AcceptRequest } from "../../api/candidate/acceptRequests";
import { removeParticipant } from "../../api/candidate/removeParticipant";

export function useAcceptRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            candidate_id,
            annonce_id,
        }: {
            candidate_id: string;
            annonce_id: string;
        }) => AcceptRequest(candidate_id, annonce_id),

        onSuccess: (_, variables) => {
            // 🔄 Rafraîchir les listes concernées
            queryClient.invalidateQueries({
                queryKey: ["notifications_owner"],
            });

            queryClient.invalidateQueries({
                queryKey: ["announcement", variables.annonce_id],
            });
        },
    });
}

export function useRemoveParticipant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            annonceId,
            participantId,
            conversationId,
        }: {
            annonceId: string;
            participantId: string;
            conversationId: string;
        }) => removeParticipant({ annonceId, participantId, conversationId }),
        onSuccess: (_, variables) => {
            // 🔄 Rafraîchir les listes concernées
            queryClient.invalidateQueries({
                queryKey: ["announcement", variables.annonceId],
            });
        },
    });
}
