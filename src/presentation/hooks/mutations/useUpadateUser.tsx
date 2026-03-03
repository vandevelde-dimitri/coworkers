import { UpdateUserProfileUseCase } from "@/src/application/use-case/user/UpdateUserProfile";
import { UpdateUserPayload } from "@/src/domain/entities/user/User";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { CustomToast } from "@/src/presentation/components/ui/CustomToast";
import { useToast } from "@/src/presentation/components/ui/molecules/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

const userRepo = new SupabaseUserRepository();
const useCase = new UpdateUserProfileUseCase(userRepo);

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ payload }: { payload: UpdateUserPayload }) =>
      useCase.execute(payload),
    onError: (error) => {
      toast.show(<CustomToast title="Erreur" message={error.message} />, {
        type: "error",
        duration: 4000,
      });
    },
    onSuccess: () => {
      toast.show(
        <CustomToast title="Succès" message="Modification réussie" />,
        {
          duration: 5000,
          position: "top",
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
