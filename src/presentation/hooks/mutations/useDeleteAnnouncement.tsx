import { DeleteAnnouncementUseCase } from "@/src/application/use-case/announcement/DeleteAnnouncement";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";
import { useAuth } from "../authContext";

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const toast = useToast();
  const userId = session?.user?.id;

  const useCase = useMemo(() => {
    const repo = SupabaseAnnouncementRepository.getInstance();
    return new DeleteAnnouncementUseCase(repo);
  }, []);

  return useMutation({
    mutationFn: (id: string) => useCase.execute(id),

    onSuccess: (_, id) => {
      toast.show(<CustomToast title="Succès" message="Suppression réussie" />, {
        type: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements", id] });
      queryClient.invalidateQueries({ queryKey: ["conversations", userId] });
      queryClient.invalidateQueries({ queryKey: ["announcements", "owner"] });
    },
    onError: () => {
      toast.show(<CustomToast title="Erreur" message="Suppression échouée" />, {
        type: "error",
      });
    },
  });
}
