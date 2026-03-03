import { UpdateAvatarUserUseCase } from "@/src/application/use-case/user/UploadAvatarUser";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

const userRepo = new SupabaseUserRepository();
const useCase = new UpdateAvatarUserUseCase(userRepo);

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: string) => useCase.execute(payload),
    onError: (error) => {
      Alert.alert("Erreur lors de la modification", error.message);
    },
    onSuccess: () => {
      Alert.alert("Modification réussie");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
