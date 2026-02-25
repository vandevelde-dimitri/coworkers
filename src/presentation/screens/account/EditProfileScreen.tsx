import { UserContract, UserTeam } from "@/src/domain/entities/user/User.enum";
import { capitalize } from "@/utils/capitalize";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import * as yup from "yup";

import { AppButton } from "../../components/ui/AppButton";
import { FormInput } from "../../components/ui/FormInput";
import { FormSelect } from "../../components/ui/FormSelect";
import { MenuItem } from "../../components/ui/MenuItem";
import { MenuSection } from "../../components/ui/MenuSection";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";

// Import de ton type de payload
import { UpdateUserPayload } from "@/src/domain/entities/user/User";
import { useUpdateUser } from "../../hooks/mutations/useUpadateUser";
import { useFloors } from "../../hooks/queries/useFloor";
import { useCurrentUser } from "../../hooks/queries/useUser";

export default function EditProfileScreen() {
  const { data: user } = useCurrentUser();
  const { data: floors } = useFloors();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const centersOptions = floors?.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const contractOptions = Object.values(UserContract).map((c) => ({
    label: capitalize(c),
    value: c,
  }));

  const teamOptions = Object.values(UserTeam).map((t) => ({
    label: capitalize(t),
    value: t,
  }));

  const schema: yup.ObjectSchema<UpdateUserPayload> = yup.object({
    firstName: yup.string().required("Prénom requis"),
    lastName: yup.string().required("Nom requis"),
    city: yup.string().required("Ville requise"),
    fcId: yup.string().required("Centre requis"),
    team: yup
      .string<UserTeam>()
      .oneOf(Object.values(UserTeam))
      .required("Équipe requise"),
    contract: yup
      .string<UserContract>()
      .oneOf(Object.values(UserContract))
      .required("Contrat requis"),
    fcName: yup.string(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UpdateUserPayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      city: user?.city || "",
      fcId: user?.fcId || "",
      contract: user?.contract,
      team: user?.team,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        fcId: user.fcId,
        contract: user.contract,
        team: user.team,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UpdateUserPayload) => {
    updateUser({ payload: data });
  };

  return (
    <ScreenWrapper title="Modifier mon profil" showBackButton={true}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <MenuSection title="Photo de profil">
          <MenuItem
            label="Changer ma photo"
            icon="image"
            onPress={() => console.log("Upload photo")}
          />
        </MenuSection>

        <MenuSection title="Identité">
          <View style={styles.formCard}>
            <FormInput
              name="firstName"
              control={control}
              label="Prénom"
              placeholder="Ton prénom"
            />
            <FormInput
              name="lastName"
              control={control}
              label="Nom"
              placeholder="Ton nom"
            />
            <FormInput
              name="city"
              control={control}
              label="Ville"
              placeholder="Ta ville actuelle"
            />
          </View>
        </MenuSection>

        <MenuSection title="Informations Amazon">
          <View style={styles.formCard}>
            <FormSelect
              name="fcId"
              control={control}
              label="Site de travail"
              options={centersOptions || []}
              placeholder="Sélectionner un site"
            />
            <FormSelect
              name="contract"
              control={control}
              label="Type de contrat"
              options={contractOptions}
              placeholder="Ton contrat"
            />
            <FormSelect
              name="team"
              control={control}
              label="Équipe de travail"
              options={teamOptions}
              placeholder="Ton équipe"
            />
          </View>
        </MenuSection>

        <View style={styles.footer}>
          <AppButton
            disabled={!isDirty || isPending}
            isLoading={isPending}
            title={
              isDirty ? "Enregistrer les modifications" : "Aucun changement"
            }
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  formCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    gap: 15,
  },
  footer: {
    marginTop: 10,
  },
});
