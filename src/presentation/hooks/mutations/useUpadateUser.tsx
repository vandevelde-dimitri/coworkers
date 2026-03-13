import { UpdateUserProfileUseCase } from "@/src/application/use-case/user/UpdateUserProfile";
import { UpdateUserPayload } from "@/src/domain/entities/user/User";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { CustomToast } from "@/src/presentation/components/ui/CustomToast";
import { useToast } from "@/src/presentation/components/ui/molecules/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

const userRepo = SupabaseUserRepository.getInstance();
const useCase = new UpdateUserProfileUseCase(userRepo);

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ payload }: { payload: UpdateUserPayload }) =>
      useCase.execute(payload),
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
