import { getCurrentUser } from "@/api/user/getCurrentUser";
import { useAuth } from "@/hooks/authContext";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
    const { session } = useAuth();

    return useQuery({
        queryKey: ["currentUser", session?.user?.id],
        queryFn: () => getCurrentUser(session!),
        enabled: !!session,
    });
}
