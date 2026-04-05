import { UpdateEmailUseCase } from "@/src/application/use-case/auth/UpdateEmail";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

export const useUpdateEmail = () => {
  const toast = useToast();

  const useCase = useMemo(() => {
    const authRepo = SupabaseAuthRepository.getInstance();
    return new UpdateEmailUseCase(authRepo);
  }, []);

  return useMutation({
    mutationFn: (email: string) => useCase.execute(email),
    onError: () => {
      toast.show(
        <CustomToast title="Erreur" message="Impossible de modifier l'email" />,
        { type: "error" },
      );
    },
    onSuccess: () => {
      toast.show(
        <CustomToast
          title="Vérification"
          message="Consultez votre nouvelle boîte mail pour valider !"
        />,
        { type: "success" },
      );
    },
  });
};
