import { Floor } from "@/src/domain/entities/floors/Floors";
import { IFloorsRepository } from "@/src/domain/repositories/FloorsRepository";
import { FloorMapper } from "../mappers/FloorMapper";
import { supabase } from "../supabase";

export class SupabaseFloorRepository implements IFloorsRepository {
    async getAllFloors(): Promise<Floor[]> {
        const { data: floors, error } = await supabase
            .from("fc")
            .select("*")
            .order("name", { ascending: true });

        if (error) throw error;

        return (floors || []).map((f) => FloorMapper.toDomain(f));
    }
}
