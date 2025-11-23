import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/user/getCurrentUser";
import { uploadUserAvatar } from "../../api/user/uploadUserAvatar";
import { useAuth } from "../../contexts/authContext";

export function useCurrentUser() {
    const { session } = useAuth();

    return useQuery({
        queryKey: ["currentUser", session?.user?.id],
        queryFn: () => getCurrentUser(session!),
        enabled: !!session,
    });
}

export function useUploadAvatar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            imageUri,
            userId,
        }: {
            imageUri: string;
            userId: string;
        }) => uploadUserAvatar(imageUri, userId),

        onSuccess: () => {
            // Met à jour le cache du user actuel
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
        },
    });
}
