import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import deleteAnnouncement from "../../api/announcement/deleteAnnouncement";
import { getAllAnnouncementByFc } from "../../api/announcement/getAllAnnouncementByFc";
import { getAllAnnouncementFavorite } from "../../api/announcement/getAllAnnouncementFavorite";
import { getAnnouncementById } from "../../api/announcement/getAnnouncementById";
import { getAnnouncementByCurrentUser } from "../../api/announcement/getAnnouncementCurrentUser";
import addAnnouncement from "../../api/announcement/postAnnouncement";
import updateAnnouncement from "../../api/announcement/updateAnnouncement";
import { useAuth } from "../../contexts/authContext";
import { AnnouncementFormValues } from "../../types/announcement.interface";

export function useAnnouncementByFc() {
    return useQuery({
        queryKey: ["announcements"],
        queryFn: getAllAnnouncementByFc,
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

export function useAnnouncementsFavorites() {
    return useQuery({
        queryKey: ["announcements", "favorites"],
        queryFn: () => getAllAnnouncementFavorite(),
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
