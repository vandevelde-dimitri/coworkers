import { Announcement } from "../entities/announcement/Announcement";

export interface IFavoriteRepository {
  getFavoriteStatus(userId: string, annonceId: string): Promise<boolean>;
  toggleFavorite(
    userId: string,
    annonceId: string,
    value: boolean,
  ): Promise<void>;
  getFavoriteAnnouncements(
    page: number,
    pageSize: number,
  ): Promise<{ announcements: Announcement[]; totalCount: number }>;
}
