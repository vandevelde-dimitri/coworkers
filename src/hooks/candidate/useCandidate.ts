import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AcceptRequest } from "../../api/candidate/acceptRequests";

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
