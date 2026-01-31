import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import * as yup from "yup";
import { showToast } from "../../../utils/showToast";
import { supabase } from "../../../utils/supabase";
import Button from "../../components/ui/Button";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { FormInput } from "../../components/ui/FormInput";
import { navigationRef } from "../../navigation/RootNavigation";

export default function UpdatePasswordScreen({ route, navigation }: any) {
    const { access_token, refresh_token } = route.params || {};
    const [isloading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const schema = yup.object({
        password: yup
            .string()
            .min(6, "Minimum 6 caractères")
            .required("Mot de passe requis"),
        confirmPassword: yup
            .string()
            .oneOf(
                [yup.ref("password")],
                "Les mots de passe ne correspondent pas",
            )
            .required("Confirmation requise"),
    });

    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const init = async () => {
            if (!access_token) {
                showToast("error", "Session de récupération manquante.");
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: "Welcome" }],
                });
                return;
            }

            const { error } = await supabase.auth.setSession({
                access_token,
                refresh_token: refresh_token || "",
            });

            if (error) {
                showToast("error", "Le lien a expiré.");
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: "Welcome" }],
                });
            }
            setIsReady(true);
        };
        init();
    }, [access_token]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (error) throw error;

            showToast("success", "Mot de passe mis à jour !");
            await supabase.auth.signOut();

            navigationRef.reset({
                index: 0,
                routes: [{ name: "Welcome" }],
            });
        } catch (error: any) {
            let friendlyMessage = "Une erreur est survenue.";

            if (error.message.includes("different from the old password")) {
                friendlyMessage =
                    "Le nouveau mot de passe doit être différent de l'ancien.";
            } else if (error.status === 422) {
                friendlyMessage =
                    "Le mot de passe est trop faible ou invalide.";
            } else if (error.message.includes("JWT")) {
                friendlyMessage =
                    "Votre session a expiré. Veuillez recommencer la procédure.";
            }

            showToast("error", friendlyMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isReady) {
        return (
            <ScreenWrapper>
                <ActivityIndicator size="large" style={{ flex: 1 }} />
                <Text
                    style={{
                        textAlign: "center",
                        marginTop: 20,
                        fontSize: 16,
                        color: "#666",
                    }}
                >
                    Vérification de la session...
                </Text>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: 20,
                    justifyContent: "center",
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 10,
                        textAlign: "center",
                    }}
                >
                    Nouveau mot de passe
                </Text>
                <Text
                    style={{
                        color: "#666",
                        textAlign: "center",
                        marginBottom: 30,
                    }}
                >
                    Choisissez un mot de passe robuste pour sécuriser votre
                    compte.
                </Text>

                <View
                    style={{
                        backgroundColor: "#fff",
                        padding: 16,
                        borderRadius: 12,
                    }}
                >
                    <FormInput
                        control={control}
                        name="password"
                        label="Nouveau mot de passe"
                        placeholder="••••••"
                        type="password"
                    />
                    <FormInput
                        control={control}
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        placeholder="••••••"
                        type="password"
                    />
                    <Button
                        label={isloading ? "Chargement..." : "Enregistrer"}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isloading}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
