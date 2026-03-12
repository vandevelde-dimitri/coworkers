import { UpdatePasswordUseCase } from "@/src/application/use-case/auth/UpdatePassword";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { useMutation } from "@tanstack/react-query";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

const authRepo = new SupabaseAuthRepository();
const useCase = new UpdatePasswordUseCase(authRepo);

export const useUpdatePassword = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: (password: string) => useCase.execute(password),
    onError: () => {
      toast.show(
        <CustomToast
          title="Erreur"
          message="Impossible de modifier le mot de passe"
        />,
        { type: "error" },
      );
    },
    onSuccess: () => {
      toast.show(
        <CustomToast
          title="Succès"
          message="Mot de passe modifié avec succès"
        />,
        { type: "success" },
      );
    },
  });
};
