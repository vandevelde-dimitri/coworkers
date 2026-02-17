import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from "react-native";
import * as yup from "yup";
import { AppButton } from "../../components/ui/AppButton";
import { FormDatePicker } from "../../components/ui/FormDatePicker";
import { FormInput } from "../../components/ui/FormInput";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useCreateAnnouncement } from "../../hooks/mutations/useCreateAnnouncement";
import { useUpdateAnnouncement } from "../../hooks/mutations/useUpdateAnnouncement";
import { useAnnouncementDetails } from "../../hooks/queries/useAnnouncementDetails";

export default function AnnouncementFormScreen({
    announcementId,
}: {
    announcementId: string;
}) {
    const isEditMode = !!announcementId;

    const { mutate: createAnnouncement, isPending: pendingCreate } =
        useCreateAnnouncement();
    const { mutate: updateAnnouncement, isPending: pendingUpdate } =
        useUpdateAnnouncement();
    const { data: announcement, isLoading } =
        useAnnouncementDetails(announcementId);

    const schema = yup.object({
        title: yup.string().required("Titre requis"),
        content: yup.string().required("Description requise"),
        places: yup
            .number()
            .typeError("Nombre de places invalide")
            .required("Nombre de places requis")
            .min(1, "Au moins 1 place")
            .max(7, "Au maximum 7 places"),
        dateStart: yup
            .date()
            .typeError("Date invalide")
            .required("Date de début requise"),
        dateEnd: yup.date().nullable().typeError("Date invalide"),
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (isEditMode && announcement) {
            reset({
                title: announcement.title,
                content: announcement.content,
                places: announcement.places,
                dateStart: new Date(announcement.dateStart),
                dateEnd: announcement.dateEnd
                    ? new Date(announcement.dateEnd)
                    : null,
            });
        } else if (!isEditMode) {
            reset({
                title: "",
                content: "",
                places: 1,
                dateStart: new Date(),
                dateEnd: null,
            });
        }
    }, [announcement, isEditMode, announcementId, reset]);

    if (isEditMode && isLoading) {
        return (
            <ScreenWrapper title="Modifier l'annonce" showBackButton={true}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <ActivityIndicator style={{ flex: 1 }} />
                </ScrollView>
            </ScreenWrapper>
        );
    }

    const onSubmit = (data: any) => {
        if (isEditMode) {
            updateAnnouncement({
                id: announcementId,
                payload: data,
            });
            return;
        }
        createAnnouncement(data);
    };

    return (
        <ScreenWrapper
            title={isEditMode ? "Modifier mon annonce" : "Créer une annonce"}
            showBackButton={false}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <FormInput
                        name="title"
                        control={control}
                        label="Titre"
                        placeholder="Entrez un titre"
                        type="text"
                    />
                    <FormInput
                        name="content"
                        control={control}
                        label="Description"
                        placeholder="Décris ton trajet"
                        type="textarea"
                    />
                    <FormInput
                        name="places"
                        control={control}
                        label="Nombre de places"
                        placeholder="Ex: 3"
                        type="number"
                    />
                    <FormDatePicker
                        name="dateStart"
                        control={control}
                        label="Date de début"
                    />
                    <FormDatePicker
                        name="dateEnd"
                        control={control}
                        label="Date de fin (optionnel)"
                    />
                    <AppButton
                        disabled={
                            pendingCreate ||
                            pendingUpdate ||
                            (isEditMode && !isDirty)
                        }
                        isLoading={pendingCreate || pendingUpdate}
                        title={
                            pendingCreate || pendingUpdate
                                ? "Enregistrement en cours..."
                                : isEditMode
                                  ? "Enregistrer les modifications"
                                  : "Créer l'annonce"
                        }
                        onPress={handleSubmit(onSubmit)}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    scrollContent: { padding: 20, paddingBottom: 150 },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
    },
});
