import { GetUserProfile } from "@/src/application/use-case/user/GetUserProfile";
import { UserPublic } from "@/src/domain/entities/user/User";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetUserProfile = <T = UserPublic>(userId: string) => {
  const useCase = useMemo(() => {
    const repo = SupabaseUserRepository.getInstance();
    return new GetUserProfile(repo);
  }, []);

  return useQuery<T | null>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const result = await useCase.execute(userId);
      return result as T;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!userId,
  });
};
