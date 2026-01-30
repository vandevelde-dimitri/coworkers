// hooks/useApply.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    applyToAnnonce,
    cancelApplication,
    getUserRequest,
} from "../api/announcement/apply.service";

export function useApply(annonceId?: string, userId?: string) {
    const queryClient = useQueryClient();
    const queryKey = ["apply", annonceId, userId];

    const requestQuery = useQuery({
        queryKey,
        queryFn: () => getUserRequest(annonceId!, userId!),
        enabled: !!annonceId && !!userId,
    });

    const toggleMutation = useMutation({
        mutationFn: async () => {
            if (requestQuery.data) {
                await cancelApplication(
                    annonceId!,
                    userId!,
                    requestQuery.data.status,
                );
                return null;
            } else {
                return applyToAnnonce(annonceId!, userId!);
            }
        },

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey });

            const previous = queryClient.getQueryData(queryKey);

            // optimistic update
            queryClient.setQueryData(queryKey, (old: any) =>
                old
                    ? null
                    : {
                          annonce_id: annonceId,
                          user_id: userId,
                          status: "pending",
                      },
            );

            return { previous };
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            queryClient.invalidateQueries({
                queryKey: ["announcement", annonceId],
            });
        },

        onError: (_err, _v, ctx) => {
            if (ctx?.previous !== undefined) {
                queryClient.setQueryData(queryKey, ctx.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        request: requestQuery.data,
        isLoading: requestQuery.isLoading || toggleMutation.isPending,
        toggleApply: toggleMutation.mutateAsync,
    };
}
