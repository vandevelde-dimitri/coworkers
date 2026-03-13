import { GetFavoriteStatusUseCase } from "@/src/application/use-case/favorite/GetFavoriteStatus";
import { ToggleFavoriteUseCase } from "@/src/application/use-case/favorite/ToggleFavorite";
import { SupabaseFavoriteRepository } from "@/src/infrastructure/repositories/SupabaseFavoriteRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export function useFavorite(userId?: string, annonceId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ["favorite", userId, annonceId];

  const { getFavoriteStatusUseCase, toggleFavoriteUseCase } = useMemo(() => {
    const repo = SupabaseFavoriteRepository.getInstance();
    return {
      getFavoriteStatusUseCase: new GetFavoriteStatusUseCase(repo),
      toggleFavoriteUseCase: new ToggleFavoriteUseCase(repo),
    };
  }, []);

  const favoriteQuery = useQuery({
    queryKey,
    queryFn: () => getFavoriteStatusUseCase.execute(userId!, annonceId!),
    enabled: !!userId && !!annonceId,
  });

  const toggleMutation = useMutation({
    mutationFn: (value: boolean) =>
      toggleFavoriteUseCase.execute(userId!, annonceId!, value),

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
      queryClient.invalidateQueries({
        queryKey: ["favoriteAnnouncements"],
      });
    },
  });

  return {
    isFavorite: favoriteQuery.data ?? false,
    isLoading: favoriteQuery.isLoading,
    toggleFavorite: toggleMutation.mutateAsync,
  };
}
