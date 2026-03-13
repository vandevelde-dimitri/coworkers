import { SupabaseApplicationRepository } from "@/src/infrastructure/repositories/SupabaseApplicationRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export function useApply(annonceId?: string, userId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ["apply", annonceId, userId];

  const repo = useMemo(() => SupabaseApplicationRepository.getInstance(), []);

  const requestQuery = useQuery({
    queryKey,
    queryFn: () => repo.getRequest(annonceId!, userId!),
    enabled: !!annonceId && !!userId,
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (requestQuery.data) {
        await repo.cancel(annonceId!, userId!);
      } else {
        await repo.apply(annonceId!, userId!);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: any) =>
        old
          ? null
          : { annonce_id: annonceId, user_id: userId, status: "pending" },
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement", annonceId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.previous !== undefined)
        queryClient.setQueryData(queryKey, ctx.previous);
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
