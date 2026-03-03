import { RegisterUseCase } from "@/src/application/use-case/auth/Register";
import { Register } from "@/src/domain/entities/auth/Register";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

const authRepo = new SupabaseAuthRepository();
const useCase = new RegisterUseCase(authRepo);

export const useRegister = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: Register) =>
      useCase.execute(payload.email, payload.password),
    onError: (error) => {
      toast.show(<CustomToast title="Erreur" message="Inscription échouée" />, {
        type: "error",
      });
    },
    onSuccess: () => {
      toast.show(<CustomToast title="Succès" message="Inscription réussie" />, {
        type: "success",
      });
    },
  });
};
