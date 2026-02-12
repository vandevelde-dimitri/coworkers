// presentation/hooks/queries/useAnnouncements.ts
import { useQuery } from "@tanstack/react-query";
import { GetAnnouncementsList } from "../../../application/use-case/announcement/GetAnnouncementsList";
import { SupabaseAnnouncementRepository } from "../../../infrastructure/repositories/SupabaseAnnouncementRepository";

const repo = new SupabaseAnnouncementRepository();
const useCase = new GetAnnouncementsList(repo);

export const useAnnouncements = (page: number, fcId: string | null) => {
    return useQuery({
        queryKey: ["announcements", { fcId, page }],
        queryFn: () => useCase.execute(page, 5, fcId),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    });
};
