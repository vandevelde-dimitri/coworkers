import { GetOwnerAnnouncement } from "@/src/application/use-case/announcement/GetOwnerAnnouncement";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useOwnerAnnouncement = () => {
  const useCase = useMemo(() => {
    const repo = SupabaseAnnouncementRepository.getInstance();
    return new GetOwnerAnnouncement(repo);
  }, []);

  return useQuery({
    queryKey: ["announcements", "owner"],
    queryFn: () => useCase.execute(),
    staleTime: 1000 * 60 * 5,
  });
};
