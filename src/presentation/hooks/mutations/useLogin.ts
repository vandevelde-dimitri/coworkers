import { LoginUseCase } from "@/src/application/use-case/auth/Login";
import { Register } from "@/src/domain/entities/auth/Register";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

const authRepo = new SupabaseAuthRepository();
const useCase = new LoginUseCase(authRepo);

export const useLogin = () => {
    return useMutation({
        mutationFn: (payload: Register) =>
            useCase.execute(payload.email, payload.password),
        onError: (error) => {
            Alert.alert("Erreur de connexion", error.message);
        },
        onSuccess: () => {
            Alert.alert(
                "Connexion réussie",
                "Bienvenue ! Vous êtes maintenant connecté.",
            );
        },
    });
};
