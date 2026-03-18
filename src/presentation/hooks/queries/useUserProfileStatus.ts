import { GetUserProfileStatusUseCase } from "@/src/application/use-case/user/GetUserProfileStatus";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useUserProfileStatus = (enabled: boolean = true) => {
  const useCase = useMemo(() => {
    const userRepo = SupabaseUserRepository.getInstance();
    return new GetUserProfileStatusUseCase(userRepo);
  }, []);

  return useQuery({
    queryKey: ["user-profile-status"],
    queryFn: () => useCase.execute(),
    staleTime: 1000 * 60 * 5,
    enabled: enabled, // 👈 C'est ici que le verrouillage se fait
  });
};
