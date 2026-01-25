import { yupResolver } from "@hookform/resolvers/yup";
import * as Linking from "expo-linking";
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
    // On récupère l'URL actuelle (qu'elle vienne du démarrage ou d'un changement)
    const url = Linking.useLinkingURL();
    useEffect(() => {
        const init = async () => {
            // Plus besoin de Linking.getInitialURL() ici !
            if (access_token) {
                console.log("✅ Token reçu des params, activation session...");
                const { error } = await supabase.auth.setSession({
                    access_token: access_token,
                    refresh_token: refresh_token || "",
                });

                if (error) console.error("Erreur setSession:", error.message);
            }
            setIsReady(true);
        };
        init();
    }, [access_token]);

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            // 1. On vérifie si on a une session, sinon on tente de la ré-extraire de l'URL
            // let {
            //     data: { user },
            // } = await supabase.auth.getUser();

            // if (!user) {
            //     console.log(
            //         "🔄 Session manquante, tentative de récupération via l'URL...",
            //     );
            //     const url = await Linking.getInitialURL();
            //     const accessToken = url?.match(/access_token=([^&]+)/)?.[1];

            //     if (accessToken) {
            //         const { data: sessionData } =
            //             await supabase.auth.setSession({
            //                 access_token: accessToken,
            //                 refresh_token:
            //                     url?.match(/refresh_token=([^&]+)/)?.[1] || "",
            //             });
            //         user = sessionData.user;
            //     }
            // }

            // if (!user) {
            //     throw new Error(
            //         "Session d'authentification introuvable. Veuillez cliquer à nouveau sur le lien dans votre email.",
            //     );
            // }

            // 2. Si on a un user, on update
            const { error } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (error) throw error;

            showToast("success", "Mot de passe mis à jour !");
            await supabase.auth.signOut();

            // Force la navigation vers Welcome car UpdatePassword est hors du flux conditionnel
            navigationRef.reset({
                index: 0,
                routes: [{ name: "Welcome" }],
            });
        } catch (error: any) {
            console.error("❌ Erreur finale :", error);
            showToast("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 4. Affiche un loader tant que la session n'est pas vérifiée
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
                    />
                    <FormInput
                        control={control}
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        placeholder="••••••"
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
