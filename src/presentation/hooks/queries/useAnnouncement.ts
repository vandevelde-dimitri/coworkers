// presentation/hooks/queries/useAnnouncements.ts
import { useQuery } from "@tanstack/react-query";
import { GetAnnouncementsList } from "../../../application/use-case/announcement/GetAnnouncementsList";
import { SupabaseAnnouncementRepository } from "../../../infrastructure/repositories/SupabaseAnnouncementRepository";

const repo = new SupabaseAnnouncementRepository();
const useCase = new GetAnnouncementsList(repo);

export const useAnnouncements = (
    page: number,
    page_size: number,
    fcId: string | null,
) => {
    return useQuery({
        queryKey: ["announcements", { fcId, page_size, page }],
        queryFn: () => useCase.execute(page, page_size, fcId),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    });
};
