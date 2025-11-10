import { useQuery } from "@tanstack/react-query";
import { getAllFc } from "../api/getAllFc";

export function useFloorsAll() {
    return useQuery({
        queryKey: ["floors"],
        queryFn: getAllFc,
    });
}
