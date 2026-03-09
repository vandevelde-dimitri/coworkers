import { GetSettingsUseCase } from "@/src/application/use-case/setting/GetSettings";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/SupabaseSettingRepository";
import { useQuery } from "@tanstack/react-query";

const repo = new SupabaseSettingsRepository();
const useCase = new GetSettingsUseCase(repo);

export const useGetSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => useCase.execute(),
  });
};
