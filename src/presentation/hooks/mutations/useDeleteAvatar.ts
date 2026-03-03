import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { DeleteAvatarUseCase } from "./../../../application/use-case/user/deleteAvatar";

const userRepo = new SupabaseUserRepository();
const useCase = new DeleteAvatarUseCase(userRepo);

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => useCase.execute(),
    onError: (error) => {
      Alert.alert("Erreur lors de la suppression de l'avatar", error.message);
    },
    onSuccess: () => {
      Alert.alert("Suppression réussie");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
