import { SendContactMessageUseCase } from "@/src/application/use-case/contact/SendContactMessage";
import { ContactMessage } from "@/src/domain/entities/contact/ContactMessage";
import { SupabaseContactRepository } from "@/src/infrastructure/repositories/SupabaseContactRepository";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

export const useSendContact = () => {
  const toast = useToast();

  const useCase = useMemo(() => {
    const contactRepo = SupabaseContactRepository.getInstance();
    return new SendContactMessageUseCase(contactRepo);
  }, []);

  return useMutation({
    mutationFn: (message: ContactMessage) => useCase.execute(message),
    onError: (error: any) => {
      const errorMessage = getErrorMessage(error.message);
      toast.show(<CustomToast title="Erreur" message={errorMessage} />, {
        type: "error",
      });
    },
    onSuccess: () => {
      toast.show(
        <CustomToast
          title="Succès"
          message="Votre message a été envoyé avec succès"
        />,
        {
          type: "success",
        },
      );
    },
  });
};

const getErrorMessage = (error: string): string => {
  const errorMap: Record<string, string> = {
    subject_required: "Le sujet est requis",
    subject_too_long: "Le sujet ne peut pas dépasser 100 caractères",
    message_required: "Le message est requis",
    message_too_long: "Le message ne peut pas dépasser 5000 caractères",
    email_address_invalid: "Adresse email invalide",
    user_not_authenticated: "Vous devez être connecté pour envoyer un message",
    user_email_missing: "Votre email n'est pas configuré",
    failed_to_send_message: "Impossible d'envoyer le message",
  };

  return errorMap[error] || "Une erreur s'est produite";
};
