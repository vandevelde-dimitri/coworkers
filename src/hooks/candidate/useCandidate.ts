import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../../../utils/showToast";
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
            queryClient.invalidateQueries({
                queryKey: ["notifications_owner"],
            });

            queryClient.invalidateQueries({
                queryKey: ["announcement", variables.annonce_id],
            });

            //! invalider aussi la conversation liée
            queryClient.invalidateQueries({
                queryKey: ["conversation", variables.annonce_id],
            });

            queryClient.invalidateQueries({
                queryKey: ["announcement", "currentUser"],
            });

            showToast("success", "Demande acceptée avec succès !");
        },
        onError: (error) => {
            showToast(
                "error",
                "Une erreur est survenue lors de l'acceptation de la demande.",
            );
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
            queryClient.invalidateQueries({
                queryKey: ["announcement", variables.annonceId],
            });
            queryClient.invalidateQueries({
                queryKey: ["announcement", "currentUser"],
            });
            queryClient.invalidateQueries({
                queryKey: ["conversation", variables.conversationId],
            });
            showToast("success", "Participant supprimé avec succès !");
        },
        onError: (error) => {
            showToast(
                "error",
                "Une erreur est survenue lors de la suppression du participant.",
            );
        },
    });
}
