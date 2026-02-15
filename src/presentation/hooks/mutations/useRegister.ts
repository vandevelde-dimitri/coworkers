import { RegisterUseCase } from "@/src/application/use-case/auth/Register";
import { Register } from "@/src/domain/entities/auth/Register";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

const authRepo = new SupabaseAuthRepository();
const useCase = new RegisterUseCase(authRepo);

export const useRegister = () => {
    return useMutation({
        mutationFn: (payload: Register) =>
            useCase.execute(payload.email, payload.password),
        onError: (error) => {
            Alert.alert("Erreur d'inscription", error.message);
        },
        onSuccess: () => {
            Alert.alert(
                "Inscription réussie",
                "Vous pouvez maintenant vous connecter.",
            );
        },
    });
};
