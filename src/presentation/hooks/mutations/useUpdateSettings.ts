import { UpdateSettingsUseCase } from "@/src/application/use-case/setting/UpdateSettings";
import { Settings } from "@/src/domain/entities/setting/Setting";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/SupabaseSettingRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useUpdateSettings = (userId: string) => {
  const queryClient = useQueryClient();

  const useCase = useMemo(() => {
    const repo = SupabaseSettingsRepository.getInstance();
    return new UpdateSettingsUseCase(repo);
  }, []);

  return useMutation({
    mutationFn: (updates: Partial<Settings>) => {
      if (!userId) {
        throw new Error(
          "Impossible de mettre à jour les paramètres : userId manquant.",
        );
      }
      return useCase.execute(userId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
};
