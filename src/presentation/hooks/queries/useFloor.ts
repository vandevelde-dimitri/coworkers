import { GetFloors } from "@/src/application/use-case/floor/GetFloors";
import { SupabaseFloorRepository } from "@/src/infrastructure/repositories/SupabaseFloorRepository";
import { useQuery } from "@tanstack/react-query";

const repo = new SupabaseFloorRepository();
const useCase = new GetFloors(repo);

export const useFloors = () => {
    return useQuery({
        queryKey: ["floors"],
        queryFn: () => useCase.execute(),
        staleTime: 1000 * 60 * 60,
    });
};
