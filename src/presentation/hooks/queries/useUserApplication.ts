import { GetUserApplicationsUseCase } from "@/src/application/use-case/application/GetUserApplications";
import { SupabaseApplicationRepository } from "@/src/infrastructure/repositories/SupabaseApplicationRepository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useUserApplications = () => {
  const useCase = useMemo(() => {
    const repo = SupabaseApplicationRepository.getInstance();
    return new GetUserApplicationsUseCase(repo);
  }, []);

  return useQuery({
    queryKey: ["user-applications", "mine"],
    queryFn: () => useCase.execute(),
    staleTime: 1000 * 60 * 5, // 5 minutes de cache
  });
};
