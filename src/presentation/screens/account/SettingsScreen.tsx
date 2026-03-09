import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import * as yup from "yup";
import { View } from "../../components/Themed";
import { AppButton } from "../../components/ui/AppButton";
import { MenuDisclosureSection } from "../../components/ui/DisclosureMenu";
import { FormInput } from "../../components/ui/FormInput";
import { FormMenuSwitch } from "../../components/ui/FormSwitch";
import { MenuItem } from "../../components/ui/MenuItem";
import { MenuSection } from "../../components/ui/MenuSection";
import { ScreenWrapper } from "../../components/ui/ScreenWrapper";
import { useAuth } from "../../hooks/authContext";
import { useUpdateSettings } from "../../hooks/mutations/useUpdateSettings";
import { useGetSettings } from "../../hooks/queries/useSettings";

export default function SettingsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { data: settings } = useGetSettings();

  const user = session?.user;
  const updateSettings = useUpdateSettings(user?.id ?? "");

  const settingsSchema = yup.object({
    vibrations: yup.boolean(),
    notificationPush: yup.boolean(),
    toConvey: yup.boolean(),
    available: yup.boolean(),
  });
  const emailSchema = yup.object({
    email: yup.string().email("Email invalide").required("Email requis"),
  });

  const passwordSchema = yup.object({
    password: yup
      .string()
      .min(6, "6 caractères minimum")
      .required("Mot de passe requis"),
  });

  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: user?.email ?? "",
    },
  });

  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const settingsForm = useForm({
    resolver: yupResolver(settingsSchema),
    defaultValues: {
      vibrations: false,
      notificationPush: true,
      toConvey: false,
      available: false,
    },
  });

  useEffect(() => {
    if (!settings) return;

    settingsForm.reset({
      vibrations: settings.vibrations,
      notificationPush: settings.notificationPush,
      toConvey: settings.toConvey,
      available: !settings.available,
    });
  }, [settings, settingsForm]);

  return (
    <ScreenWrapper showBackButton={true} title="Paramètres">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <MenuSection title="Mes informations">
          <MenuItem
            onPress={() => router.push("/(tabs)/account/edit")}
            icon="person"
            label="Modifier mon profil"
          />
        </MenuSection>
        <MenuSection title="Préférences">
          <FormMenuSwitch
            name="notificationPush"
            control={settingsForm.control}
            label="Notifications Push"
            description="Recevoir une alerte pour les nouveaux messages"
            icon="notifications"
            onAfterChange={(value) =>
              updateSettings.mutate({ notificationPush: value })
            }
          />
          <FormMenuSwitch
            name="vibrations"
            control={settingsForm.control}
            label="Vibrations"
            description="Activer les vibrations pour les notifications"
            icon="pulse"
            onAfterChange={(value) =>
              updateSettings.mutate({ vibrations: value })
            }
          />
          <FormMenuSwitch
            name="toConvey"
            control={settingsForm.control}
            label="Véhiculer"
            icon="car"
            onAfterChange={(value) =>
              updateSettings.mutate({ toConvey: value })
            }
          />
          <FormMenuSwitch
            name="available"
            control={settingsForm.control}
            label="Mode vacances"
            icon="airplane"
            onAfterChange={(value) =>
              updateSettings.mutate({ available: !value })
            }
          />
        </MenuSection>
        <MenuDisclosureSection title="Sécurité">
          <FormInput
            control={emailForm.control}
            name="email"
            label="Email"
            type="email"
            iconName="mail-outline"
            placeholder="john@doe.fr"
          />
          <AppButton
            title="Modifier mon email"
            variant="secondary"
            onPress={() => console.log("modifier email")}
          />
          <View style={{ height: 20, backgroundColor: "transparent" }} />
          <FormInput
            name="password"
            control={passwordForm.control}
            label="Nouveau mot de passe"
            placeholder="••••••••"
            type="password"
          />
          <AppButton
            title="Changer le mot de passe"
            variant="secondary"
            onPress={() => console.log("modifier pwd")}
          />
        </MenuDisclosureSection>
        <MenuDisclosureSection title="Zone de danger">
          <AppButton
            title="Supprimer mon compte"
            variant="danger"
            onPress={() => console.log("supprimer compte")}
          />
        </MenuDisclosureSection>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 150 },
});
