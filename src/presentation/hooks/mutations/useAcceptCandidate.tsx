import { AcceptCandidateUseCase } from "@/src/application/use-case/notification/AcceptCandidate";
import { SupabaseParticipantRepository } from "@/src/infrastructure/repositories/SupabaseParticipantRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const repo = new SupabaseParticipantRepository();
const useCase = new AcceptCandidateUseCase(repo);

export const useAcceptCandidate = () => {
  const queryClient = useQueryClient();

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
