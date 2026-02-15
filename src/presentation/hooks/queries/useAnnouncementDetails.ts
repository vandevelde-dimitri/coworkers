import { GetAnnouncementById } from "@/src/application/use-case/announcement/GetAnnouncementById";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { useQuery } from "@tanstack/react-query";

const repo = new SupabaseAnnouncementRepository();
const useCase = new GetAnnouncementById(repo);

export const useAnnouncementDetails = (announcementId: string) => {
    return useQuery({
        queryKey: ["announcements", announcementId],
        queryFn: () => useCase.execute(announcementId),
        staleTime: 1000 * 60 * 5,
        enabled: !!announcementId,
    });
};
