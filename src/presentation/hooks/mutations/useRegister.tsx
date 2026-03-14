import { RegisterUseCase } from "@/src/application/use-case/auth/Register";
import { Register } from "@/src/domain/entities/auth/Register";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";
import { getAuthErrorMessage } from "@/utils/authError";

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
      const error_message = getAuthErrorMessage(error);

      toast.show(<CustomToast title="Erreur" message={error_message} />, {
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
