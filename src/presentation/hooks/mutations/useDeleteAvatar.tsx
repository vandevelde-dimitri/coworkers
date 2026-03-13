import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAvatarUseCase } from "../../../application/use-case/user/deleteAvatar";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

const userRepo = SupabaseUserRepository.getInstance();
const useCase = new DeleteAvatarUseCase(userRepo);

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: () => useCase.execute(),
    onError: (error) => {
      toast.show(<CustomToast title="Erreur" message="Suppression échouée" />, {
        type: "error",
      });
    },
    onSuccess: () => {
      toast.show(<CustomToast title="Succès" message="Suppression réussie" />, {
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
