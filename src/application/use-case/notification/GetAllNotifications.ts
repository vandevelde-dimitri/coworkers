import { INotificationRepository } from "@/src/domain/repositories/NotificationRepository";

export class GetNotificationsUseCase {
  constructor(private repository: INotificationRepository) {}

  async execute() {
    return await this.repository.getAllNotifications();
  }
}
