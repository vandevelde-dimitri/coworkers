// Exemple : src/screens/home/HomeScreen.tsx
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import * as yup from "yup";
import { showToast } from "../../../utils/showToast";
import { supabase } from "../../../utils/supabase";
import Button from "../../components/ui/Button";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { Section } from "../../components/ui/CustomSection";
import { FormInput } from "../../components/ui/FormInput";

export default function ForgotPwdScreen() {
    const navigation = useNavigation();
    const schema = yup.object({
        email: yup.string().email("Email invalide").required("Email requis"),
    });
    const { control, handleSubmit } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: { email: string }) => {
        const { email } = data;
        // On génère l'URL de retour vers l'app
        const redirectTo = Linking.createURL("reset-password");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo,
        });

        if (error) {
            showToast("error", error.message);
        } else {
            showToast("success", "Lien envoyé ! Vérifiez vos emails.");
        }
    };

    return (
        <ScreenWrapper back>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 16,
                }}
            >
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: "700",
                        marginBottom: 32,
                        textAlign: "center",
                    }}
                >
                    Mot de passe oublié
                </Text>
                <Section>
                    <View
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 18,
                            padding: 16,
                            marginBottom: 16,
                        }}
                    >
                        <FormInput
                            control={control}
                            name="email"
                            label="Email"
                            placeholder="john@doe.fr"
                            type="email"
                        />
                        <Button
                            label="Réinitialiser mon mot de passe"
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </Section>
            </ScrollView>
        </ScreenWrapper>
    );
}
