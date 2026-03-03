import { UpdateAvatarUserUseCase } from "@/src/application/use-case/user/UploadAvatarUser";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useToast } from "../../components/ui/molecules/Toast";
import { CustomToast } from "../../components/ui/CustomToast";

const userRepo = new SupabaseUserRepository();
const useCase = new UpdateAvatarUserUseCase(userRepo);

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: string) => useCase.execute(payload),
    onError: (error) => {
      toast.show(
        <CustomToast title="Erreur" message="Modification échouée" />,
        {
          type: "error",
        },
      );
    },
    onSuccess: () => {
      toast.show(
        <CustomToast title="Succès" message="Modification réussie" />,
        {
          type: "success",
        },
      );
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
