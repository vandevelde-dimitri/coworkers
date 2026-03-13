import { RegisterUseCase } from "@/src/application/use-case/auth/Register";
import { Register } from "@/src/domain/entities/auth/Register";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

export const useRegister = () => {
  const toast = useToast();

  const useCase = useMemo(() => {
    const authRepo = SupabaseAuthRepository.getInstance();
    return new RegisterUseCase(authRepo);
  }, []);

  return useMutation({
    mutationFn: (payload: Register) =>
      useCase.execute(payload.email, payload.password),
    onError: (error) => {
      let message = "Une erreur est survenue.";

      if (error.message === "email not valid") {
        message = "Le format de l'email est invalide.";
      } else if (error.message === "pwd not valid") {
        message = "Le mot de passe ne respecte pas les critères de sécurité.";
      }

      toast.show(<CustomToast title="Erreur" message={message} />, {
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
