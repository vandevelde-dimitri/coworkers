import { GetFavoriteAnnouncementsUseCase } from "@/src/application/use-case/favorite/GetFavoriteAnnouncements";
import { SupabaseFavoriteRepository } from "@/src/infrastructure/repositories/SupabaseFavoriteRepository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useUserFavoriteAnnouncements = (
  page: number = 1,
  pageSize: number = 10,
) => {
  const useCase = useMemo(() => {
    const repo = SupabaseFavoriteRepository.getInstance();
    return new GetFavoriteAnnouncementsUseCase(repo);
  }, []);

  return useQuery({
    queryKey: ["favoriteAnnouncements", page, pageSize],
    queryFn: () => useCase.execute(page, pageSize),
    staleTime: 1000 * 60 * 5,
  });
};
