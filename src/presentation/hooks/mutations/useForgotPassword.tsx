import { ForgotPasswordUseCase } from "@/src/application/use-case/auth/ForgotPassword";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { getAuthErrorMessage } from "@/utils/authError";
import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { useMemo } from "react";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

export const useForgotPassword = () => {
  const toast = useToast();

  const useCase = useMemo(() => {
    const authRepo = SupabaseAuthRepository.getInstance();
    return new ForgotPasswordUseCase(authRepo);
  }, []);

  const redirectTo = Linking.createURL("reset-password");
  return useMutation({
    mutationFn: (email: string) => useCase.execute(email, redirectTo),
    onError: (error) => {
      const error_message = getAuthErrorMessage(error);

      toast.show(<CustomToast title="Erreur" message={error_message} />, {
        type: "error",
      });
    },
    onSuccess: () => {
      toast.show(
        <CustomToast
          title="Succès"
          message="Lien de réinitialisation envoyé"
        />,
        {
          type: "success",
        },
      );
    },
  });
};
