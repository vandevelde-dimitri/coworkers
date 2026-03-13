import { GetAnnouncementById } from "@/src/application/use-case/announcement/GetAnnouncementById";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useAnnouncementDetails = (announcementId: string) => {
  const useCase = useMemo(() => {
    const repo = SupabaseAnnouncementRepository.getInstance();
    return new GetAnnouncementById(repo);
  }, []);

  return useQuery({
    queryKey: ["announcements", announcementId],
    queryFn: () => useCase.execute(announcementId),
    staleTime: 1000 * 60 * 5,
    enabled: !!announcementId,
  });
};
