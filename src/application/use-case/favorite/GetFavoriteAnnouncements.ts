import { Announcement } from "../../../domain/entities/announcement/Announcement";
import { IFavoriteRepository } from "../../../domain/repositories/FavoriteRepository";

export class GetFavoriteAnnouncementsUseCase {
  constructor(private favoriteRepo: IFavoriteRepository) {}

  async execute(
    page: number,
    pageSize: number = 5,
  ): Promise<{ announcements: Announcement[]; totalCount: number }> {
    return await this.favoriteRepo.getFavoriteAnnouncements(page, pageSize);
  }
}
