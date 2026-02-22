import { UserContract, UserTeam } from "@/src/domain/entities/user/User.enum";
import { capitalize } from "@/utils/capitalize";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import * as yup from "yup";
import { AppButton } from "../../components/ui/AppButton";
import { FormInput } from "../../components/ui/FormInput";
import { FormSelect } from "../../components/ui/FormSelect";
import { MenuItem } from "../../components/ui/MenuItem";
import { MenuSection } from "../../components/ui/MenuSection";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useFloors } from "../../hooks/queries/useFloor";
import { useCurrentUser } from "../../hooks/queries/useUser";

export default function EditProfileScreen() {
    const { data: user } = useCurrentUser();
    const { data: floors } = useFloors();
    const centersOptions = floors?.map((c) => ({
        label: c.name,
        value: c.id,
    }));

    const contractOptions = Object.values(UserContract).map((c: string) => ({
        label: capitalize(c),
        value: c,
    }));
    const teamOptions = Object.values(UserTeam).map((t: string) => ({
        label: capitalize(t),
        value: t,
    }));

    const schema = yup.object({
        firstName: yup.string().required("Prénom requis"),
        lastName: yup.string().required("Nom requis"),
        city: yup.string().required("Ville requise"),
        fcId: yup.string().required("Centre Amazon requis"),
        team: yup
            .mixed<UserTeam>()
            .oneOf(
                Object.values(UserTeam),
                "Veuillez sélectionner une équipe valide",
            )
            .required("Une équipe est requis")
            .nullable(),
        contract: yup
            .mixed<UserContract>()
            .oneOf(
                Object.values(UserContract),
                "Veuillez sélectionner un type de contrat valide",
            )
            .required("Le type de contrat est requis")
            .nullable(),
    });
    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm({
        resolver: yupResolver(schema),

        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            city: user?.city || "",
            fcId: user?.fcId || "",
            contract: user?.contract || undefined,
            team: user?.team || undefined,
        },
    });

    const onSubmit = (data: any) => {
        console.log("Données du formulaire :", data);
        // updateUser(data);
    };

    return (
        <ScreenWrapper title="Modifier mon profil" showBackButton={true}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <MenuSection title="Photo de profil">
                    <MenuItem
                        label="Modifier ma photo"
                        icon="image"
                        onPress={() => console.log("modifier photo")}
                    />
                </MenuSection>
                <MenuSection title="Informations personnelles">
                    <FormInput
                        name="firstName"
                        control={control}
                        label="Prénom"
                        placeholder="Prénom"
                        type="text"
                    />
                    <FormInput
                        name="lastName"
                        control={control}
                        label="Nom"
                        placeholder="Nom"
                        type="text"
                    />
                    <FormInput
                        name="city"
                        control={control}
                        label="Ville"
                        placeholder="Paris, Lyon..."
                        type="text"
                    />
                    <FormSelect
                        name="fcId"
                        control={control}
                        label="Centre Amazon"
                        placeholder="Sélectionner un centre ..."
                        options={centersOptions || []}
                    />
                    <FormSelect
                        name="contract"
                        control={control}
                        label="Contrat"
                        placeholder="Sélectionner un contrat ..."
                        options={contractOptions || []}
                    />
                    <FormSelect
                        name="team"
                        control={control}
                        label="Equipe"
                        placeholder="Sélectionner une équipe ..."
                        options={teamOptions || []}
                    />
                    <AppButton
                        disabled={!isDirty}
                        isLoading={false}
                        title={
                            isDirty
                                ? "Enregistrer les modifications"
                                : "Aucune modification à enregistrer"
                        }
                        onPress={handleSubmit(onSubmit)}
                    />
                </MenuSection>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 150 },
});
