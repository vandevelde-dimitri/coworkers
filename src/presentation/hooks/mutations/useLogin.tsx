import { LoginUseCase } from "@/src/application/use-case/auth/Login";
import { Register } from "@/src/domain/entities/auth/Register";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { getAuthErrorMessage } from "@/utils/authError";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

export const useLogin = () => {
  const toast = useToast();

  const useCase = useMemo(() => {
    const authRepo = SupabaseAuthRepository.getInstance();
    return new LoginUseCase(authRepo);
  }, []);

  return useMutation({
    mutationFn: (payload: Register) =>
      useCase.execute(payload.email, payload.password),
    onError: (error: PostgrestError) => {
      const error_message = getAuthErrorMessage(error);

      toast.show(<CustomToast title="Erreur" message={error_message} />, {
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
