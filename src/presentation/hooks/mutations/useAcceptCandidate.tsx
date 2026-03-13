import { AcceptCandidateUseCase } from "@/src/application/use-case/notification/AcceptCandidate";
import { SupabaseParticipantRepository } from "@/src/infrastructure/repositories/SupabaseParticipantRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const repo = SupabaseParticipantRepository.getInstance();
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "combined"],
      });
      queryClient.invalidateQueries({
        queryKey: ["announcements", variables.annonceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["announcements", "owner"],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["apply", variables.annonceId, variables.candidateId],
      });
    },
  });
};
