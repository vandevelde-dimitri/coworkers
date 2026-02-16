import { CreateAnnouncementUseCase } from "@/src/application/use-case/announcement/CreateAnnouncement";
import { CreateAnnouncementPayload } from "@/src/domain/entities/announcement/Announcement";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { SupabaseMessagingRepository } from "@/src/infrastructure/repositories/SupabaseMessagingRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

const repoAnnouncement = new SupabaseAnnouncementRepository();
const repoMessaging = new SupabaseMessagingRepository();
const useCase = new CreateAnnouncementUseCase(repoAnnouncement, repoMessaging);

export const useCreateAnnouncement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateAnnouncementPayload) =>
            useCase.execute(payload),
        onError: (error) => {
            Alert.alert("Erreur lors de la création", error.message);
        },
        onSuccess: () => {
            Alert.alert("Creation réussie");
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
        },
    });
};
