import { getAllAnnouncementByFc } from "@/api/announcement/getAllAnnouncementByFc";
import { getAnnouncementById } from "@/api/announcement/getAnnouncementById";
import { useQuery } from "@tanstack/react-query";

export function useAnnouncementByFc() {
    return useQuery({
        queryKey: ["announcements"],
        queryFn: getAllAnnouncementByFc,
    });
}

export function useAnnouncementById(id: string) {
    return useQuery({
        queryKey: ["announcement", id],
        queryFn: () => getAnnouncementById(id),
    });
}
