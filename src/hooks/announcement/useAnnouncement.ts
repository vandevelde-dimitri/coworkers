import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import deleteAnnouncement from "../../api/announcement/deleteAnnouncement";
import { getAllAnnouncementByFc } from "../../api/announcement/getAllAnnouncementByFc";
import { getAllAnnouncementFavorite } from "../../api/announcement/getAllAnnouncementFavorite";
import { getAnnouncementById } from "../../api/announcement/getAnnouncementById";
import { getAnnouncementByCurrentUser } from "../../api/announcement/getAnnouncementCurrentUser";
import addAnnouncement from "../../api/announcement/postAnnouncement";
import updateAnnouncement from "../../api/announcement/updateAnnouncement";
import { useAuth } from "../../contexts/authContext";
import { AnnouncementFormValues } from "../../types/announcement.interface";

export function useAnnouncementByFc(
    page: number,
    pageSize: number = 5,
    fc_id?: string | null
) {
    return useQuery({
        queryKey: ["announcements", page, pageSize, fc_id ?? "all"],
        queryFn: () => getAllAnnouncementByFc(page, pageSize, fc_id),
        placeholderData: (previousData) => previousData,
    });
}

export function useAnnouncementById(id: string, enabled?: boolean) {
    return useQuery({
        queryKey: ["announcement", id],
        queryFn: () => getAnnouncementById(id),
        enabled: !!id && enabled !== false,
    });
}

export function useAnnouncementCurrentUser() {
    return useQuery({
        queryKey: ["announcement", "currentUser"],
        queryFn: () => getAnnouncementByCurrentUser(),
    });
}

export function useAnnouncementsFavorites(page: number, pageSize: number = 5) {
    return useQuery({
        queryKey: ["announcements", "favorites"],
        queryFn: () => getAllAnnouncementFavorite(page, pageSize),
        placeholderData: (previousData) => previousData,
    });
}

export function useAddAnnouncement() {
    const queryClient = useQueryClient();
    const { session } = useAuth();

    return useMutation({
        mutationFn: (body: AnnouncementFormValues) => addAnnouncement(body),
        onSuccess: () => {
            // Invalidation du cache pour forcer le rechargement des listes d'annonces
            // et de l'annonce de l'utilisateur courant (utilisé par TravelScreen)
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            queryClient.invalidateQueries({
                queryKey: ["announcement", "currentUser"],
            });
            Toast.show({
                type: "coworkerAlert", // ou 'coworkerAlert' si tu veux ton style perso
                text1: "Succès ! ✨",
                text2: "L'annonce a été modifiée avec succès.",
                position: "bottom",
                visibilityTime: 5000, // Le toast reste 2 secondes
            });
            // // 🔄 refresh conversations
            // queryClient.invalidateQueries({
            //     queryKey: ["user-conversations", session?.user.id],
            // });
        },
    });
}

export function useUpdateAnnouncement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            body,
        }: {
            id: string;
            body: AnnouncementFormValues;
        }) => updateAnnouncement(id, body),
        onSuccess: (_, { id }) => {
            // Invalidation du cache pour l'annonce spécifique et la liste
            queryClient.invalidateQueries({ queryKey: ["announcement", id] });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            // Aussi invalider l'annonce du user courant au cas où il modifie sa propre annonce
            queryClient.invalidateQueries({
                queryKey: ["announcement", "currentUser"],
            });
        },
    });
}

export function useDeleteAnnouncement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAnnouncement(id),

        onSuccess: () => {
            // Invalidation du cache pour forcer le rechargement des listes d'annonces
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            // Si l'utilisateur supprime son annonce, s'assurer que l'écran Mon annonce est mis à jour
            queryClient.invalidateQueries({
                queryKey: ["announcement", "currentUser"],
            });
            queryClient.invalidateQueries({
                queryKey: ["user-conversations"],
                exact: false,
            });
        },
    });
}
