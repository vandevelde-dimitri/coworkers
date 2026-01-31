import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getFavoriteStatus,
    toggleFavorite,
} from "../../api/announcement/getAllAnnouncementFavorite";

export function useFavorite(userId?: string, annonceId?: string) {
    const queryClient = useQueryClient();

    const queryKey = ["favorite", userId, annonceId];

    const favoriteQuery = useQuery({
        queryKey,
        queryFn: () => getFavoriteStatus(userId!, annonceId!),
        enabled: !!userId && !!annonceId,
    });

    const toggleMutation = useMutation({
        mutationFn: (value: boolean) =>
            toggleFavorite(userId!, annonceId!, value),

        onMutate: async (newValue) => {
            await queryClient.cancelQueries({ queryKey });

            const previousValue = queryClient.getQueryData<boolean>(queryKey);

            queryClient.setQueryData(queryKey, newValue);

            return { previousValue };
        },

        onError: (_err, _value, context) => {
            if (context?.previousValue !== undefined) {
                queryClient.setQueryData(queryKey, context.previousValue);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return {
        isFavorite: favoriteQuery.data ?? false,
        isLoading: favoriteQuery.isLoading,
        toggleFavorite: toggleMutation.mutateAsync,
    };
}
