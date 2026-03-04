import { CreateAnnouncementUseCase } from "@/src/application/use-case/announcement/CreateAnnouncement";
import { CreateAnnouncementPayload } from "@/src/domain/entities/announcement/Announcement";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { SupabaseMessagingRepository } from "@/src/infrastructure/repositories/SupabaseMessagingRepository";
import { CustomToast } from "@/src/presentation/components/ui/CustomToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useToast } from "../../components/ui/molecules/Toast";

const repoAnnouncement = new SupabaseAnnouncementRepository();
const repoMessaging = new SupabaseMessagingRepository();
const useCase = new CreateAnnouncementUseCase(repoAnnouncement, repoMessaging);

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: CreateAnnouncementPayload) =>
      useCase.execute(payload),
    onError: (error) => {
      toast.show(<CustomToast title="Erreur" message="Création échouée" />, {
        type: "error",
      });
    },
    onSuccess: () => {
      toast.show(
        <CustomToast
          title="Création réussie"
          message="Une conversation a été créée"
        />,
        {
          type: "success",
        },
      );
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({
        queryKey: ["announcements", "owner"],
      });
      router.push("/(tabs)/home");
    },
  });
};
