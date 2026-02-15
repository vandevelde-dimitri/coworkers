import { UserContract, UserTeam } from "@/src/domain/entities/user/User.enum";
import { supabase } from "@/src/infrastructure/supabase";
import { AppButton } from "@/src/presentation/components/ui/AppButton";
import { FormInput } from "@/src/presentation/components/ui/FormInput";
import { FormSelect } from "@/src/presentation/components/ui/FormSelect";
import { StackHeader } from "@/src/presentation/components/ui/Header";
import { useAuth } from "@/src/presentation/hooks/authContext";
import { useFloors } from "@/src/presentation/hooks/queries/useFloor";
import { capitalize } from "@/utils/capitalize";
import { yupResolver } from "@hookform/resolvers/yup";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import * as yup from "yup";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
    const { session, refreshSession } = useAuth();
    const { data: floors } = useFloors();
    const [step, setStep] = useState(1);

    /* ===================== OPTIONS & DATA ===================== */
    const centersOptions =
        floors?.map((c) => ({ label: c.name, value: c.id })) || [];
    const contractOptions = Object.values(UserContract).map((c) => ({
        label: capitalize(c),
        value: c,
    }));
    const teamOptions = Object.values(UserTeam).map((t) => ({
        label: capitalize(t),
        value: t,
    }));

    /* ===================== FORM VALIDATION ===================== */
    const schema = yup.object({
        firstname: yup.string().required("Prénom requis"),
        lastname: yup.string().required("Nom requis"),
        city: yup.string().required("Ville requise"),
        fc_id: yup.string().required("Centre Amazon requis"),
        team: yup
            .mixed<UserTeam>()
            .oneOf(Object.values(UserTeam))
            .required("Équipe requise"),
        contract: yup
            .mixed<UserContract>()
            .oneOf(Object.values(UserContract))
            .required("Contrat requis"),
    });

    const { control, trigger, getValues } = useForm<any>({
        resolver: yupResolver(schema),
    });

    /* ===================== LOGIC ===================== */
    const handleNext = async () => {
        let fields: (keyof any)[] = [];
        if (step === 1) fields = ["firstname", "lastname"];
        if (step === 2) fields = ["city", "team"];
        if (step === 3) fields = ["fc_id", "contract"];

        const isValid = await trigger(fields);
        if (!isValid) return;

        if (step < 3) {
            setStep(step + 1);
            return;
        }

        const values = getValues();
        const userId = session?.user.id;

        if (!userId) return null;

        try {
            const { error: authError } = await supabase.auth.updateUser({
                data: { profile_completed: true },
            });
            if (authError) throw authError;

            refreshSession();
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil :", error);
        }
    };

    /* ===================== UI RENDERING ===================== */
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <StackHeader title="Nouveau Profil" />

            {/* Barre de Progression */}
            <View style={styles.progressBg}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${(step / 3) * 100}%` },
                    ]}
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.stepText}>ÉTAPE {step} SUR 3</Text>
                    <Text style={styles.title}>
                        {step === 1 && "Parlons de vous"}
                        {step === 2 && "Votre quotidien"}
                        {step === 3 && "Derniers détails"}
                    </Text>
                </View>

                <View style={styles.card}>
                    {step === 1 && (
                        <>
                            <FormInput
                                name="firstname"
                                control={control}
                                label="Prénom"
                                placeholder="Jean"
                                iconName="person-outline"
                            />
                            <FormInput
                                name="lastname"
                                control={control}
                                label="Nom"
                                placeholder="Dupont"
                                iconName="person-outline"
                            />
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <FormInput
                                name="city"
                                control={control}
                                label="Ville"
                                placeholder="Paris, Lyon..."
                                iconName="location-outline"
                            />
                            <FormSelect
                                name="team"
                                control={control}
                                label="Équipe"
                                options={teamOptions}
                            />
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <FormSelect
                                name="fc_id"
                                control={control}
                                label="Centre Amazon"
                                options={centersOptions}
                            />
                            <FormSelect
                                name="contract"
                                control={control}
                                label="Type de contrat"
                                options={contractOptions}
                            />
                        </>
                    )}
                </View>

                <View style={styles.footer}>
                    {step > 1 && (
                        <AppButton
                            title="Précédent"
                            onPress={() => setStep(step - 1)}
                            variant="secondary"
                        />
                    )}
                    <AppButton
                        title={step === 3 ? "Finaliser" : "Continuer"}
                        onPress={handleNext}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#141E30" },
    progressBg: { height: 4, backgroundColor: "rgba(255,255,255,0.05)" },
    progressFill: { height: "100%", backgroundColor: "#FFF" },
    scrollContent: { padding: 24, paddingTop: 30 },
    header: { marginBottom: 30 },
    stepText: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.5,
    },
    title: { color: "#FFF", fontSize: 28, fontWeight: "800", marginTop: 4 },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 30,
        padding: 24,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        minHeight: 280,
    },
    footer: {
        flexDirection: "column",
        gap: 12,
        marginTop: 30,
        marginBottom: 40,
        justifyContent: "center",
    },
});
