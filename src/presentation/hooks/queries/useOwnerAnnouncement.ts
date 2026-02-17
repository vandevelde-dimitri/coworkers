import { GetOwnerAnnouncement } from "@/src/application/use-case/announcement/GetOwnerAnnouncement";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { useQuery } from "@tanstack/react-query";

const repo = new SupabaseAnnouncementRepository();
const useCase = new GetOwnerAnnouncement(repo);

export const useOwnerAnnouncement = () => {
    return useQuery({
        queryKey: ["announcements", "owner"],
        queryFn: () => useCase.execute(),
        staleTime: 1000 * 60 * 5,
    });
};
