import { useMemo } from "react";
import { GetSettingsUseCase } from "@/src/application/use-case/setting/GetSettings";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/SupabaseSettingRepository";
import { useQuery } from "@tanstack/react-query";

export const useGetSettings = () => {
  const useCase = useMemo(() => {
    const repo = SupabaseSettingsRepository.getInstance();
    return new GetSettingsUseCase(repo);
  }, []);

  return useQuery({
    queryKey: ["settings"],
    queryFn: () => useCase.execute(),
  });
};
