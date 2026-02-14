import { Floor } from "@/src/domain/entities/floors/Floors";

export class FloorMapper {
    static toDomain(raw: any): Floor {
        return {
            id: raw.id,
            name: raw.name,
        };
    }
}
