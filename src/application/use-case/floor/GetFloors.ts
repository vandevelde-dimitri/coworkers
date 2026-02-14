import { Floor } from "@/src/domain/entities/floors/Floors";
import { IFloorsRepository } from "@/src/domain/repositories/FloorsRepository";
import { logger } from "@/utils/logger";

export class GetFloors {
    constructor(private floorsRepo: IFloorsRepository) {}

    async execute(): Promise<Floor[]> {
        try {
            return await this.floorsRepo.getAllFloors();
        } catch (error) {
            await logger.critical(
                "ERR_FLOOR_GET",
                `Récupération des centres de travail`,
                error,
            );
            throw error;
        }
    }
}
