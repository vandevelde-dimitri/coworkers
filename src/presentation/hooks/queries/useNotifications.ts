import { GetNotificationsUseCase } from "@/src/application/use-case/notification/GetAllNotifications";
import { SupabaseNotificationRepository } from "@/src/infrastructure/repositories/SupabaseNotificationRepository";
import { useQuery } from "@tanstack/react-query";

const repo = new SupabaseNotificationRepository();
const useCase = new GetNotificationsUseCase(repo);

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "combined"],
    queryFn: () => useCase.execute(),
    refetchInterval: 30000,
  });
};
