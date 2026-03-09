import { Settings } from "@/src/domain/entities/setting/Setting";

export class SettingsMapper {
  static toDomain(data: any): Settings {
    return {
      id: data.id,
      userId: data.user_id,
      notificationPush: data.notification_push,
      vibrations: data.vibrations,
      toConvey: data.to_convey,
      available: data.available,
    };
  }

  static toPersistence(entity: Partial<Settings>): any {
    return {
      notification_push: entity.notificationPush,
      vibrations: entity.vibrations,
      to_convey: entity.toConvey,
      available: entity.available,
    };
  }
}
