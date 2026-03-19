import { UpdateSettingsUseCase } from "@/src/application/use-case/setting/UpdateSettings";
import { Settings } from "@/src/domain/entities/setting/Setting";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/SupabaseSettingRepository";
import { CustomToast } from "@/src/presentation/components/ui/CustomToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useToast } from "../../components/ui/molecules/Toast";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const useCase = useMemo(() => {
    const repo = SupabaseSettingsRepository.getInstance();
    return new UpdateSettingsUseCase(repo);
  }, []);

  return useMutation({
    mutationFn: (updates: Partial<Settings>) => useCase.execute(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: () => {
      toast.show(
        <CustomToast
          title="Erreur"
          message="Impossible de mettre à jour les paramètres."
        />,
        { type: "error" },
      );
    },
  });
};
