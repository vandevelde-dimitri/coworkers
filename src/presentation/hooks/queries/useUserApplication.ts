import { GetUserApplicationsUseCase } from "@/src/application/use-case/application/GetUserApplications";
import { SupabaseApplicationRepository } from "@/src/infrastructure/repositories/SupabaseApplicationRepository";
import { useQuery } from "@tanstack/react-query";

const repo = SupabaseApplicationRepository.getInstance();
const useCase = new GetUserApplicationsUseCase(repo);

export const useUserApplications = () => {
  return useQuery({
    queryKey: ["user-applications", "mine"],
    queryFn: () => useCase.execute(),
    staleTime: 1000 * 60 * 5,
  });
};
