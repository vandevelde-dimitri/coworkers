import { LoginUseCase } from "@/src/application/use-case/auth/Login";
import { Register } from "@/src/domain/entities/auth/Register";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useToast } from "../../components/ui/molecules/Toast";
import { CustomToast } from "../../components/ui/CustomToast";

const authRepo = new SupabaseAuthRepository();
const useCase = new LoginUseCase(authRepo);

export const useLogin = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: Register) =>
      useCase.execute(payload.email, payload.password),
    onError: (error) => {
      toast.show(<CustomToast title="Erreur" message="Connexion échouée" />, {
        type: "error",
      });
    },
    onSuccess: () => {
      toast.show(<CustomToast title="Succès" message="Connexion réussie" />, {
        type: "success",
      });
    },
  });
};
