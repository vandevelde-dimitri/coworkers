import { CreateAnnouncementPayload } from "@/src/domain/entities/announcement/Announcement";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import * as yup from "yup";
import { AppButton } from "../../components/ui/AppButton";
import { FormDatePicker } from "../../components/ui/FormDatePicker";
import { FormInput } from "../../components/ui/FormInput";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useCreateAnnouncement } from "../../hooks/mutations/useCreateAnnouncement";

export default function CreateAnnouncementScreen() {
    const { mutate: createAnnouncement, isPending } = useCreateAnnouncement();
    const schema = yup.object({
        title: yup.string().required("Titre requis"),
        content: yup.string().required("Description requise"),
        places: yup
            .number()
            .typeError("Nombre de places invalide")
            .required("Nombre de places requis")
            .min(1, "Au moins 1 place")
            .max(7, "Au maximum 7 places"),
        dateStart: yup.string().required("Date de début requise"),
        dateEnd: yup.string(),
    });

    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: CreateAnnouncementPayload) => {
        console.log(data);

        createAnnouncement(data);
    };

    return (
        <ScreenWrapper title="Créer une annonce" showBackButton={false}>
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
                    disabled={isPending}
                    isLoading={isPending}
                    title={
                        isPending ? "Création en cours..." : "Créer l'annonce"
                    }
                    onPress={handleSubmit(onSubmit)}
                />
            </ScrollView>
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
