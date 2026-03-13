import { RejectCandidateUseCase } from "@/src/application/use-case/notification/RejectCandidate";
import { SupabaseParticipantRepository } from "@/src/infrastructure/repositories/SupabaseParticipantRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useRejectCandidate = () => {
  const queryClient = useQueryClient();

  const useCase = useMemo(() => {
    const repo = SupabaseParticipantRepository.getInstance();
    return new RejectCandidateUseCase(repo);
  }, []);

  return useMutation({
    mutationFn: ({
      candidateId,
      annonceId,
    }: {
      candidateId: string;
      annonceId: string;
    }) => useCase.execute(candidateId, annonceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "combined"],
      });
    },
  });
};
