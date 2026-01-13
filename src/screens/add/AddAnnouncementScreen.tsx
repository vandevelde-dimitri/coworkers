import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as yup from "yup";

import ScreenWrapper from "../../components/ui/CustomHeader";
import { FormDatePicker } from "../../components/ui/DatePicker";
import { FormInput } from "../../components/ui/FormInput";
import { useAuth } from "../../contexts/authContext";
import {
    useAddAnnouncement,
    useAnnouncementById,
    useUpdateAnnouncement,
} from "../../hooks/announcement/useAnnouncement";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { AnnouncementFormValues } from "../../types/announcement.interface";

export default function FormAnnouncementScreen() {
    useRequireAuth("FormStack");
    const { session } = useAuth();

    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params ?? {}; // params peut être undefined
    const isEditMode = !!id;
    const { mutate: createAnnouncement, isPending } = useAddAnnouncement();
    const { mutate: updateAnnouncement, isPending: isUpdating } =
        useUpdateAnnouncement();
    const { data: existingAnnouncement, isLoading } = useAnnouncementById(
        id as string,
        isEditMode
    );

    const schema = yup.object({
        title: yup.string().required("Titre requis"),
        content: yup.string().required("Description requise"),
        number_of_places: yup
            .number()
            .typeError("Nombre de places invalide")
            .required("Nombre de places requis")
            .min(1, "Au moins 1 place")
            .max(7, "Au maximum 7 places"),
        date_start: yup.string().required("Date de début requise"),
        date_end: yup.string(),
    });

    const { control, handleSubmit, reset } = useForm<AnnouncementFormValues>({
        resolver: yupResolver(schema),
    });

    // Préremplir le formulaire en édition
    useEffect(() => {
        if (isEditMode && existingAnnouncement) {
            reset({
                title: existingAnnouncement.title,
                content: existingAnnouncement.content,
                number_of_places: existingAnnouncement.number_of_places || 1,
                date_start: existingAnnouncement.date_start,
                date_end: existingAnnouncement.date_end || undefined,
            });
        }
    }, [isEditMode, existingAnnouncement, reset]);
    if (!session) {
        return null; // ou un splash / loader léger
    }
    if (isEditMode && isLoading) {
        return (
            <View style={styles.center}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    const onSubmit: SubmitHandler<AnnouncementFormValues> = (data) => {
        if (isEditMode) {
            updateAnnouncement(
                { id: id as string, body: data },
                {
                    onSuccess: () => {
                        reset();
                        navigation.navigate("HomeStack", {
                            screen: "HomeScreen",
                        });
                    },
                }
            );
            return;
        }

        createAnnouncement(data, {
            onSuccess: () => {
                reset();
                navigation.navigate("HomeStack", { screen: "HomeScreen" });
            },
        });
    };

    return (
        <ScreenWrapper title="Ajouter une annonce">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: 18,
                        padding: 16,
                        marginBottom: 16,
                    }}
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
                        name="number_of_places"
                        control={control}
                        label="Nombre de places"
                        placeholder="Ex: 3"
                        type="number"
                    />
                    <FormDatePicker
                        name="date_start"
                        control={control}
                        label="Date de début"
                    />
                    <FormDatePicker
                        name="date_end"
                        control={control}
                        label="Date de fin (optionnel)"
                    />
                </View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        (isPending || isUpdating) && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending || isUpdating}
                >
                    <Text style={styles.buttonText}>
                        {isEditMode
                            ? isUpdating
                                ? "Modification en cours..."
                                : "Modifier l'annonce"
                            : isPending
                            ? "Publication en cours..."
                            : "Publier l'annonce"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#2563eb",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        marginTop: 24,
    },
    buttonDisabled: {
        backgroundColor: "#9CA3AF",
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
