import { UpdateAnnouncementUseCase } from "@/src/application/use-case/announcement/UpdateAnnouncement";
import { UpdateAnnouncementPayload } from "@/src/domain/entities/announcement/Announcement";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const repoAnnouncement = new SupabaseAnnouncementRepository();
const useCase = new UpdateAnnouncementUseCase(repoAnnouncement);

export const useUpdateAnnouncement = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateAnnouncementPayload;
        }) => useCase.execute(id, payload),
        onError: (error) => {
            Alert.alert("Erreur lors de la modification", error.message);
        },
        onSuccess: (_, { id }) => {
            Alert.alert("Modification réussie");
            queryClient.invalidateQueries({ queryKey: ["announcements"] });
            queryClient.invalidateQueries({
                queryKey: ["announcements", "owner"],
            });
            queryClient.invalidateQueries({ queryKey: ["announcements", id] });
            router.push("/(tabs)/home");
        },
    });
};
