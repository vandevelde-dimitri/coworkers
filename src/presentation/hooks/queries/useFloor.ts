import { GetFloors } from "@/src/application/use-case/floor/GetFloors";
import { SupabaseFloorRepository } from "@/src/infrastructure/repositories/SupabaseFloorRepository";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFloors = () => {
  const useCase = useMemo(() => {
    const repo = SupabaseFloorRepository.getInstance();
    return new GetFloors(repo);
  }, []);

  return useQuery({
    queryKey: ["floors"],
    queryFn: () => useCase.execute(),
    staleTime: 1000 * 60 * 60,
  });
};
