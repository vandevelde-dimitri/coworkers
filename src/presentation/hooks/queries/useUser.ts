import { GetCurrentUser } from "@/src/application/use-case/user/GetCurrentUser";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useQuery } from "@tanstack/react-query";

const repo = new SupabaseUserRepository();
const useCase = new GetCurrentUser(repo);

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: () => useCase.execute(),
        staleTime: 1000 * 60 * 5,
        retry: false,
    });
};
