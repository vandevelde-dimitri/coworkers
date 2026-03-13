import { UpdateAnnouncementUseCase } from "@/src/application/use-case/announcement/UpdateAnnouncement";
import { UpdateAnnouncementPayload } from "@/src/domain/entities/announcement/Announcement";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  const useCase = useMemo(() => {
    const repoAnnouncement = SupabaseAnnouncementRepository.getInstance();
    return new UpdateAnnouncementUseCase(repoAnnouncement);
  }, []);

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAnnouncementPayload;
    }) => useCase.execute(id, payload),
    onError: () => {
      toast.show(
        <CustomToast title="Erreur" message="Modification échouée" />,
        { type: "error" },
      );
    },
    onSuccess: (_, { id }) => {
      toast.show(
        <CustomToast title="Succès" message="Modification réussie" />,
        { type: "success" },
      );
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements", "owner"] });
      queryClient.invalidateQueries({ queryKey: ["announcements", id] });
      router.push("/(tabs)/home");
    },
  });
};
