import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import deleteAnnouncement from "../../api/announcement/deleteAnnouncement";
import { getAllAnnouncementByFc } from "../../api/announcement/getAllAnnouncementByFc";
import { getAnnouncementById } from "../../api/announcement/getAnnouncementById";
import addAnnouncement from "../../api/announcement/postAnnouncement";
import updateAnnouncement from "../../api/announcement/updateAnnouncement";
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

export function useAddAnnouncement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: AnnouncementFormValues) => addAnnouncement(body),
        onSuccess: () => {
            // Invalidation du cache pour forcer le rechargement des listes d'annonces
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
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
        },
    });
}
