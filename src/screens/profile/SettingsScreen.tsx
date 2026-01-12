import FeatherIcon from "@expo/vector-icons/Feather";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { supabase } from "../../../utils/supabase";
import { onUpdateEmail } from "../../../utils/updateEmail";
import { onUpdatePassword } from "../../../utils/updatePassword";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { Section } from "../../components/ui/CustomSection";
import { FormInput } from "../../components/ui/FormInput";
import { useAuth } from "../../contexts/authContext";
import { ProfileStackParamList } from "../../types/navigation/profileStackType";

export default function SettingsScreen() {
    const { session } = useAuth();
    const user = session?.user;
    const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

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

    const logout = async () => {
        await supabase.auth.signOut();
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
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "600" }}>
                                Vibrations
                            </Text>
                            <Switch />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "600" }}>
                                Véhiculer
                            </Text>
                            <Switch />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "600" }}>
                                Mode vacances
                            </Text>
                            <Switch />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "600" }}>
                                Notification push
                            </Text>
                            <Switch />
                        </View>
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
                            type="text"
                        />
                        <TouchableOpacity
                            onPress={emailForm.handleSubmit(onUpdateEmail)}
                            disabled={emailForm.formState.isSubmitting}
                            style={{
                                backgroundColor: "#2563eb",
                                padding: 16,
                                borderRadius: 16,
                                marginBottom: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    fontWeight: "600",
                                }}
                            >
                                Modifier l’email
                            </Text>
                        </TouchableOpacity>
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
                            type="text"
                        />
                        <TouchableOpacity
                            onPress={passwordForm.handleSubmit(
                                onUpdatePassword
                            )}
                            disabled={passwordForm.formState.isSubmitting}
                            style={{
                                backgroundColor: "#2563eb",
                                padding: 16,
                                borderRadius: 16,
                                marginBottom: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    fontWeight: "600",
                                }}
                            >
                                Changer le mot de passe
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Section>

                {/* SECTION DANGER */}
                <Section title="Session">
                    <View
                        style={{
                            backgroundColor: "#fa02023b",
                            borderRadius: 18,
                            padding: 16,
                            marginBottom: 16,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: "rgba(247, 5, 5, 0.6)",
                                padding: 16,
                                borderRadius: 16,
                                marginBottom: 10,
                            }}
                            onPress={logout}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    fontWeight: "600",
                                }}
                            >
                                Se déconnecter
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "rgba(247, 5, 5, 0.6)",
                                padding: 16,
                                borderRadius: 16,
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    fontWeight: "600",
                                }}
                            >
                                Supprimer mon compte
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Section>
            </ScrollView>
        </ScreenWrapper>
    );
}
