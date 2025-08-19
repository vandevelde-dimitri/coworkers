import { getAllFc } from "@/api/getAllFc";
import { useQuery } from "@tanstack/react-query";

export function useFloorsAll() {
    return useQuery({
        queryKey: ["floors"],
        queryFn: getAllFc,
    });
}
