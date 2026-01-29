import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../../../utils/showToast";
import { getCurrentUser } from "../../api/user/getCurrentUser";
import { getSettingUser } from "../../api/user/getSettingUser";
import { getUser } from "../../api/user/getUser";
import { updateSettingUser } from "../../api/user/updateSettingsUsers";
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
export function useGetUser(user_id: string) {
    const { session } = useAuth();

    return useQuery({
        queryKey: ["getUser", user_id],
        queryFn: () => getUser(user_id),
        enabled: !!user_id && !!session,
    });
}

export function useUploadAvatar() {
    const queryClient = useQueryClient();
    const { session } = useAuth();
    return useMutation({
        mutationFn: ({ imageUri }: { imageUri: string | null }) =>
            uploadUserAvatar(imageUri),

        onSuccess: () => {
            // Met à jour le cache du user actuel
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            queryClient.invalidateQueries({
                queryKey: ["currentUser", session?.user?.id],
            });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            showToast("success", "Avatar mis à jour avec succès !");
        },
        onError: (error) => {
            if (__DEV__)
                console.error(
                    "useUploadAvatar error:",
                    (error as Error).message,
                );
            showToast(
                "error",
                "Une erreur est survenue lors de la mise à jour de l'avatar.",
            );
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
            showToast("success", "Profil mis à jour avec succès !");
        },
        onError: (error) => {
            if (__DEV__)
                console.error("useUpdateUser error:", (error as Error).message);
            showToast(
                "error",
                "Une erreur est survenue lors de la mise à jour du profil.",
            );
        },
    });
}

export function useSettingsUser() {
    const { session } = useAuth();
    const user_id = session?.user?.id;
    return useQuery({
        queryKey: ["settingsUser", user_id],
        queryFn: () => getSettingUser(user_id),
        enabled: !!user_id,
    });
}

export function useUpdateSettings() {
    const queryClient = useQueryClient();
    const { session } = useAuth();
    const user_id = session?.user?.id;
    return useMutation({
        mutationFn: (body) => updateSettingUser(body, user_id!),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["settingsUser", user_id],
            });
            queryClient.invalidateQueries({
                queryKey: ["announcements"],
            });
        },
        onError: (error) => {
            if (__DEV__)
                console.error(
                    "useUpdateSettigs error:",
                    (error as Error).message,
                );
            showToast(
                "error",
                "Une erreur est survenue lors de la mise à jour des paramétres.",
            );
        },
    });
}
