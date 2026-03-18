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
    queryFn: async () => {
      // Même logique que authContext : timeout de 5 secondes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Profile status check timeout")),
          5000,
        ),
      );

      try {
        const isCompleted = await Promise.race([
          useCase.execute(),
          timeoutPromise,
        ]);
        return isCompleted as boolean;
      } catch (error) {
        // En cas de timeout, on retourne true par prudence
        // pour éviter de bloquer l'utilisateur sur l'onboarding
        if (__DEV__)
          console.log("[ProfileStatus] Timeout - defaulting to true");
        return true;
      }
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 5,
    retry: 2, // React Query retry automatique
  });
};
