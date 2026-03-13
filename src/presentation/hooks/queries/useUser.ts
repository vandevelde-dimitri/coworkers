import { useMemo } from "react";
import { GetCurrentUser } from "@/src/application/use-case/user/GetCurrentUser";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const useCase = useMemo(() => {
    const repo = SupabaseUserRepository.getInstance();
    return new GetCurrentUser(repo);
  }, []);

  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => useCase.execute(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
