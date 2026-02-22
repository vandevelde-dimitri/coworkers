import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
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

export default function SettingsScreen() {
    const router = useRouter();
    const { session } = useAuth();
    const user = session?.user;

    const settingsSchema = yup.object({
        vibrations: yup.boolean(),
        notification_push: yup.boolean(),
        to_convey: yup.boolean(),
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
        values: {
            vibrations: false,
            notification_push: true,
            to_convey: false,
            available: false,
        },
    });
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
                        name="notifications_push"
                        control={settingsForm.control}
                        label="Notifications Push"
                        description="Recevoir une alerte pour les nouveaux messages"
                        icon="notifications"
                    />
                    <FormMenuSwitch
                        name="vibrations"
                        control={settingsForm.control}
                        label="Vibrations"
                        description="Activer les vibrations pour les notifications"
                        icon="pulse"
                    />
                    <FormMenuSwitch
                        name="to_convey"
                        control={settingsForm.control}
                        label="Véhiculer"
                        icon="car"
                    />
                    <FormMenuSwitch
                        name="available"
                        control={settingsForm.control}
                        label="Mode vacances"
                        icon="airplane"
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
                    <View
                        style={{ height: 20, backgroundColor: "transparent" }}
                    />
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
