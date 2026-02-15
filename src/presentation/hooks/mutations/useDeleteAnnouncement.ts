import { DeleteAnnouncementUseCase } from "@/src/application/use-case/announcement/DeleteAnnouncement";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../authContext";

const repo = new SupabaseAnnouncementRepository();
const useCase = new DeleteAnnouncementUseCase(repo);

export function useDeleteAnnouncement() {
    const queryClient = useQueryClient();
    const { session } = useAuth();
    const userId = session?.user?.id;
    return useMutation({
        mutationFn: (id: string) => useCase.execute(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
        },
        onError: () => {},
    });
}
