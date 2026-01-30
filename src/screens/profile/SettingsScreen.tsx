import FeatherIcon from "@expo/vector-icons/Feather";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { showToast } from "../../../utils/showToast";
import { supabase } from "../../../utils/supabase";
import { useUpdateEmail } from "../../../utils/updateEmail";
import { onUpdatePassword } from "../../../utils/updatePassword";
import { deleteAccount } from "../../api/account/deleteAccount";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { Section } from "../../components/ui/CustomSection";
import { FormInput } from "../../components/ui/FormInput";
import { FormSwitch } from "../../components/ui/FormSwitch";
import { useAuth } from "../../contexts/authContext";
import { useSettingsUser, useUpdateSettings } from "../../hooks/user/useUsers";
import { ProfileStackParamList } from "../../types/navigation/profileStackType";
import { logger } from "../../../utils/logger";

export default function SettingsScreen() {
    const { session } = useAuth();
    const user = session?.user;
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
    const { data: settings } = useSettingsUser();
    const { updateEmail } = useUpdateEmail();
    const { mutate: updateSettings } = useUpdateSettings();
    const [openLogout, setOpenLogout] = useState(false);
    const [openDestroy, setOpenDestroy] = useState(false);

    const emailSchema = yup.object({
        email: yup.string().email("Email invalide").required("Email requis"),
    });

    const passwordSchema = yup.object({
        password: yup
            .string()
            .min(6, "6 caractères minimum")
            .required("Mot de passe requis"),
    });

    const settingsSchema = yup.object({
        vibrations: yup.boolean(),
        notification_push: yup.boolean(),
        to_convey: yup.boolean(),
        available: yup.boolean(),
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

    console.log("setting => ", settings);

    const settingsForm = useForm({
        resolver: yupResolver(settingsSchema),
        values: {
            vibrations: settings?.vibrations ?? false,
            notification_push: settings?.notification_push ?? true,
            to_convey: settings?.to_convey ?? false,
            available: settings?.available ?? false,
        },
    });

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const onDeleteAccount = async () => {
        try {
            await deleteAccount();
            await supabase.auth.signOut();
            showToast("success", "Compte supprimé définitivement");
        } catch (e) {
            await logger.critical("delete_account", e, user?.id);
            showToast("error", "Impossible de supprimer le compte");
        }
    };

    const onChangeEmail = async (data: { email: string }) => {
        await updateEmail(data.email);
    };
    /* ===================== UI ===================== */

    return (
        <ScreenWrapper back title="Paramètres">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* SECTION PROFIL */}
                <Section title="Informations du profil">
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#fff",
                            padding: 16,
                            borderRadius: 18,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                        }}
                        onPress={() => navigation.navigate("EditProfileScreen")}
                    >
                        <FeatherIcon
                            name={"airplay"}
                            size={18}
                            color="#111827"
                        />
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 15,
                                fontWeight: "600",
                            }}
                        >
                            Modifier mon profil
                        </Text>
                        <FeatherIcon
                            name="chevron-right"
                            size={18}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>
                </Section>
                <Section title="Préférences">
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 18,
                            padding: 16,
                        }}
                    >
                        <FormSwitch
                            name="vibrations"
                            control={settingsForm.control}
                            label="Vibrations"
                            description="Activer le retour haptique lors des notifications"
                            onAfterChange={(val) =>
                                updateSettings({ vibrations: val })
                            }
                        />
                        <FormSwitch
                            name="to_convey"
                            control={settingsForm.control}
                            label="Véhiculer"
                            onAfterChange={(val) =>
                                updateSettings({ to_convey: val })
                            }
                        />
                        <FormSwitch
                            name="available"
                            control={settingsForm.control}
                            label="Mode vacances"
                            onAfterChange={(val) =>
                                updateSettings({ available: val })
                            }
                        />
                        <FormSwitch
                            name="notification_push"
                            control={settingsForm.control}
                            label="Notifications push"
                            onAfterChange={(val) =>
                                updateSettings({ notification_push: val })
                            }
                        />
                    </View>
                </Section>
                {/* SECTION SÉCURITÉ */}
                <Section title="Sécurité">
                    {/* EMAIL */}
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 18,
                            padding: 16,
                            marginBottom: 16,
                        }}
                    >
                        <FormInput
                            name="email"
                            control={emailForm.control}
                            label="Email"
                            placeholder="ex: prenom.nom@amazon.com"
                            type="email"
                        />
                        <Button
                            label="Modifier mon email"
                            variant="secondary"
                            onPress={emailForm.handleSubmit(onChangeEmail)}
                            disabled={emailForm.formState.isSubmitting}
                        />
                    </View>

                    {/* PASSWORD */}
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 18,
                            padding: 16,
                            marginBottom: 16,
                        }}
                    >
                        <FormInput
                            name="password"
                            control={passwordForm.control}
                            label="Nouveau mot de passe"
                            placeholder="••••••••"
                            type="password"
                        />
                        <Button
                            label="Changer le mot de passe"
                            variant="secondary"
                            onPress={passwordForm.handleSubmit(async (data) => {
                                await onUpdatePassword(data);
                                passwordForm.reset();
                            })}
                            disabled={passwordForm.formState.isSubmitting}
                        />
                    </View>
                </Section>

                {/* SECTION DANGER */}
                <Section title="Session">
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 18,
                            padding: 16,
                            marginBottom: 16,
                            borderLeftWidth: 3,
                            borderLeftColor: "#dc2626",
                        }}
                    >
                        <Button
                            label="Se déconnecter"
                            variant="danger"
                            onPress={() => setOpenLogout(true)}
                        />
                        <ConfirmModal
                            visible={openLogout}
                            title="Voulez-vous vous déconnecter ?"
                            description="Vous pourrez vous reconnecter à tout moment."
                            confirmLabel="Oui"
                            cancelLabel="Non"
                            onCancel={() => setOpenLogout(false)}
                            onConfirm={() => {
                                setOpenLogout(false);
                                logout();
                                showToast("success", "Déconnexion réussie");
                            }}
                        />
                        <View style={{ height: 12 }} />
                        <Button
                            label="Supprimer mon compte"
                            variant="danger"
                            onPress={() => setOpenDestroy(true)}
                        />
                        <ConfirmModal
                            visible={openDestroy}
                            title="Voulez-vous vraiment supprimer votre compte ?"
                            description="Vous perdrez toutes vos données de manière définitive."
                            confirmLabel="Oui"
                            cancelLabel="Non"
                            onCancel={() => setOpenDestroy(false)}
                            onConfirm={async () => {
                                setOpenDestroy(false);
                                await onDeleteAccount();
                            }}
                            danger
                        />
                    </View>
                </Section>
            </ScrollView>
        </ScreenWrapper>
    );
}
