import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/user/getCurrentUser";
import { useAuth } from "../../contexts/authContext";

export function useCurrentUser() {
    const { session } = useAuth();

    return useQuery({
        queryKey: ["currentUser", session?.user?.id],
        queryFn: () => getCurrentUser(session!),
        enabled: !!session,
    });
}
