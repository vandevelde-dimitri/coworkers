import { getAllAnnouncementByFc } from "@/api/announcement/getAllAnnouncementByFc";
import { useQuery } from "@tanstack/react-query";

export function useAnnouncementByFc() {
    return useQuery({
        queryKey: ["announcements"],
        queryFn: getAllAnnouncementByFc,
    });
}
