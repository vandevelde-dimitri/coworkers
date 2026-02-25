import { UpdateUserProfileUseCase } from "@/src/application/use-case/user/UpdateUserProfile";
import { UpdateUserPayload } from "@/src/domain/entities/user/User";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

const userRepo = new SupabaseUserRepository();
const useCase = new UpdateUserProfileUseCase(userRepo);

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ payload }: { payload: UpdateUserPayload }) =>
            useCase.execute(payload),
        onError: (error) => {
            Alert.alert("Erreur lors de la modification", error.message);
        },
        onSuccess: () => {
            Alert.alert("Modification réussie");
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
        },
    });
};
