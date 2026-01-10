import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/user/getCurrentUser";
import { updateUser } from "../../api/user/updateUser";
import { uploadUserAvatar } from "../../api/user/uploadUserAvatar";
import { useAuth } from "../../contexts/authContext";
import { EditProfileFormValues } from "../../types/user.interface";

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
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ body }: { body: EditProfileFormValues }) =>
            updateUser(body),

        onSuccess: () => {
            // Met à jour le cache du user actuel
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
        },
    });
}
