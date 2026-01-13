import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../../../utils/showToast";
import deleteAnnouncement from "../../api/announcement/deleteAnnouncement";
import { getAllAnnouncementByFc } from "../../api/announcement/getAllAnnouncementByFc";
import { getAllAnnouncementFavorite } from "../../api/announcement/getAllAnnouncementFavorite";
import { getAnnouncementById } from "../../api/announcement/getAnnouncementById";
import { getAnnouncementByCurrentUser } from "../../api/announcement/getAnnouncementCurrentUser";
import addAnnouncement from "../../api/announcement/postAnnouncement";
import updateAnnouncement from "../../api/announcement/updateAnnouncement";
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

    return useMutation({
        mutationFn: addAnnouncement,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            queryClient.invalidateQueries({
                queryKey: ["announcement", "currentUser"],
            });
            showToast(
                "success",
                "Annonce créée avec succès",
                "Une conversation a été ouverte"
            );
        },
        onError: (error: any) => {
            if (error?.code === "23505") {
                showToast(
                    "warning",
                    "Annonce déjà active",
                    "Vous avez déjà une annonce en cours"
                );
                return;
            }
            showToast(
                "error",
                "Une erreur est survenue lors de la création de l'annonce."
            );
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
            queryClient.invalidateQueries({ queryKey: ["announcement", id] });
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            queryClient.invalidateQueries({
                queryKey: ["announcement", "currentUser"],
            });
            showToast("success", "Votre annonce à était modifié avec succès !");
        },
        onError: () => {
            showToast(
                "error",
                "Une erreur est survenue lors de la modification de l'annonce."
            );
        },
    });
}

export function useDeleteAnnouncement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAnnouncement(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            queryClient.invalidateQueries({
                queryKey: ["announcement", "currentUser"],
            });
            queryClient.invalidateQueries({
                queryKey: ["user-conversations"],
                exact: false,
            });
            showToast("success", "Votre annonce à était supprimé !");
        },
        onError: () => {
            showToast(
                "error",
                "Une erreur est survenue lors de la suppression de l'annonce."
            );
        },
    });
}
