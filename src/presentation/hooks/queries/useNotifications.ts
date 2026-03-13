import { GetNotificationsUseCase } from "@/src/application/use-case/notification/GetAllNotifications";
import { SupabaseNotificationRepository } from "@/src/infrastructure/repositories/SupabaseNotificationRepository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useNotifications = () => {
  const useCase = useMemo(() => {
    const repo = SupabaseNotificationRepository.getInstance();
    return new GetNotificationsUseCase(repo);
  }, []);

  return useQuery({
    queryKey: ["notifications", "combined"],
    queryFn: () => useCase.execute(),
  });
};
