import { useQuery } from "@tanstack/react-query";
import { GetAnnouncementsList } from "../../../application/use-case/announcement/GetAnnouncementsList";
import { SupabaseAnnouncementRepository } from "../../../infrastructure/repositories/SupabaseAnnouncementRepository";

const repo = new SupabaseAnnouncementRepository();
const useCase = new GetAnnouncementsList(repo);

export const useAnnouncements = (
    page: number,
    page_size: number,
    search: string,
    sortBy: string,
    fcId: string | null,
) => {
    return useQuery({
        queryKey: ["announcements", { fcId, page_size, page, search, sortBy }],
        queryFn: () => useCase.execute(page, page_size, search, sortBy, fcId),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    });
};
