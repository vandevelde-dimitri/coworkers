import { RemoveParticipantUseCase } from "@/src/application/use-case/notification/RemoveCandidate";
import { SupabaseParticipantRepository } from "@/src/infrastructure/repositories/SupabaseParticipantRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useRemoveParticipant = () => {
  const queryClient = useQueryClient();

  const useCase = useMemo(() => {
    const repo = SupabaseParticipantRepository.getInstance();
    return new RemoveParticipantUseCase(repo);
  }, []);

  return useMutation({
    mutationFn: ({
      annonceId,
      participantId,
      conversationId,
    }: {
      annonceId: string;
      participantId: string;
      conversationId: string;
    }) => useCase.execute(annonceId, participantId, conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
