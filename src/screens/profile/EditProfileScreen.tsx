import FeatherIcon from "@expo/vector-icons/Feather";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { capitalize } from "../../../utils/capitalize";
import Button from "../../components/ui/Button";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { Section } from "../../components/ui/CustomSection";
import { FormInput } from "../../components/ui/FormInput";
import { FormSelect } from "../../components/ui/FormSelect";
import { useFloorsAll } from "../../hooks/useFloor";
import { useCurrentUser, useUpdateUser } from "../../hooks/user/useUsers";
import { Contract } from "../../types/enum/contract.enum";
import { Team } from "../../types/enum/team.enum";
import { EditProfileFormValues } from "../../types/user.interface";

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { data: user } = useCurrentUser();
    const { data: floors } = useFloorsAll();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const centersOptions = floors?.map((c) => ({
        label: c.name,
        value: c.id,
    }));

    const contractOptions = Object.values(Contract).map((c: string) => ({
        label: capitalize(c),
        value: c,
    }));
    const teamOptions = Object.values(Team).map((t: string) => ({
        label: capitalize(t),
        value: t,
    }));

    const schema = yup.object({
        firstname: yup.string().required("Prénom requis"),
        lastname: yup.string().required("Nom requis"),
        city: yup.string().required("Ville requise"),
        fc_id: yup.string().required("Centre Amazon requis"),
        team: yup
            .mixed<Team>()
            .oneOf(
                Object.values(Team),
                "Veuillez sélectionner une équipe valide",
            )
            .required("Une équipe est requis"),
        contract: yup
            .mixed<Contract>()
            .oneOf(
                Object.values(Contract),
                "Veuillez sélectionner un type de contrat valide",
            )
            .required("Le type de contrat est requis"),
    });
    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty },
    } = useForm<EditProfileFormValues>({
        resolver: yupResolver(schema),

        defaultValues: {
            firstname: user?.firstname || "",
            lastname: user?.lastname || "",
            city: user?.city || "",
            fc_id: user?.fc_id || "",
            contract: user?.contract || undefined,
            team: user?.team || undefined,
        },
    });

    const onSave: SubmitHandler<EditProfileFormValues> = (data) => {
        console.log("data", data);

        updateUser({ body: data });
        reset();
        navigation.goBack();
    };

    return (
        <ScreenWrapper back title="Modifier le profil">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* PHOTO */}
                <Section title="Photo de profil">
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#fff",
                            padding: 16,
                            borderRadius: 18,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                        onPress={() =>
                            navigation.navigate("AvatarRegistrationScreen")
                        }
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: "600",
                            }}
                        >
                            Modifier ma photo
                        </Text>
                        <FeatherIcon
                            name="chevron-right"
                            size={18}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                </Section>

                {/* INFOS */}
                <Section title="Informations">
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 18,
                            padding: 16,
                            marginBottom: 16,
                        }}
                    >
                        <FormInput
                            name="firstname"
                            control={control}
                            label="Prénom"
                            placeholder="Prénom"
                            type="text"
                        />
                        <FormInput
                            name="lastname"
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
                            name="fc_id"
                            control={control}
                            label="Centre Amazon"
                            placeholder="Sélectionner un centre ..."
                            options={centersOptions || []}
                        />
                        <FormSelect
                            name="contract"
                            control={control}
                            label="Contrat"
                            placeholder="Sélectionner un badge ..."
                            options={contractOptions || []}
                        />
                        <FormSelect
                            name="team"
                            control={control}
                            label="Equipe"
                            placeholder="Sélectionner une équipe ..."
                            options={teamOptions || []}
                        />
                    </View>
                </Section>
                <Button
                    onPress={handleSubmit(onSave)}
                    variant={isDirty ? "primary" : "disabled"}
                    label={
                        isUpdating
                            ? "Enregistrement en cours ..."
                            : "Enregistrer"
                    }
                    disabled={isUpdating || !isDirty}
                />
            </ScrollView>
        </ScreenWrapper>
    );
}
