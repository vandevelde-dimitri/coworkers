import { IFavoriteRepository } from "../../../domain/repositories/FavoriteRepository";

export class ToggleFavoriteUseCase {
  constructor(private favoriteRepo: IFavoriteRepository) {}

  async execute(
    userId: string,
    annonceId: string,
    value: boolean,
  ): Promise<void> {
    await this.favoriteRepo.toggleFavorite(userId, annonceId, value);
  }
}
