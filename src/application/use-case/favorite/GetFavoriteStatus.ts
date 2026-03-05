import { IFavoriteRepository } from "../../../domain/repositories/FavoriteRepository";

export class GetFavoriteStatusUseCase {
  constructor(private favoriteRepo: IFavoriteRepository) {}

  async execute(userId: string, annonceId: string): Promise<boolean> {
    return await this.favoriteRepo.getFavoriteStatus(userId, annonceId);
  }
}
