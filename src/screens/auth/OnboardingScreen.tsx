import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import * as yup from "yup";
import { capitalize } from "../../../utils/capitalize";
import { showToast } from "../../../utils/showToast";
import { supabase } from "../../../utils/supabase";
import { updateUser } from "../../api/user/updateUser";
import Button from "../../components/ui/Button";
import ScreenWrapper from "../../components/ui/CustomHeader";
import { FormInput } from "../../components/ui/FormInput";
import { FormSelect } from "../../components/ui/FormSelect";
import { useAuth } from "../../contexts/authContext";
import { useFloorsAll } from "../../hooks/useFloor";
import { Contract } from "../../types/enum/contract.enum";
import { Team } from "../../types/enum/team.enum";
import { EditProfileFormValues } from "../../types/user.interface";

export default function OnboardingScreen() {
    const { refreshSession } = useAuth();
    const { data: floors } = useFloorsAll();
    const [step, setStep] = useState(1);

    /* ===================== OPTIONS ===================== */

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

    /* ===================== FORM ===================== */

    const schema = yup.object({
        firstname: yup.string().required("Prénom requis"),
        lastname: yup.string().required("Nom requis"),
        city: yup.string().required("Ville requise"),
        fc_id: yup.string().required("Centre Amazon requis"),
        team: yup
            .mixed<Team>()
            .oneOf(Object.values(Team))
            .required("Équipe requise"),
        contract: yup
            .mixed<Contract>()
            .oneOf(Object.values(Contract))
            .required("Contrat requis"),
    });

    const { control, trigger, getValues } = useForm<EditProfileFormValues>({
        resolver: yupResolver(schema),
    });

    /* ===================== HANDLERS ===================== */

    const handleNext = async () => {
        let fields: (keyof EditProfileFormValues)[] = [];

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

        await supabase.auth.updateUser({
            data: {
                profile_completed: true,
            },
        });

        await updateUser(values);
        showToast(
            "success",
            "Inscription réussie !",
            "Un email de confirmation a été envoyé.",
        );
        refreshSession();
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const cardStyle = {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={cardStyle}>
                        <FormInput
                            name="firstname"
                            control={control}
                            label="Prénom"
                            placeholder="Votre prénom"
                            type="text"
                        />
                        <FormInput
                            name="lastname"
                            control={control}
                            label="Nom"
                            placeholder="Votre nom"
                            type="text"
                        />
                    </View>
                );

            case 2:
                return (
                    <View style={cardStyle}>
                        <FormInput
                            name="city"
                            control={control}
                            label="Ville"
                            placeholder="Paris, Lyon…"
                            type="text"
                        />
                        <FormSelect
                            name="team"
                            control={control}
                            label="Équipe"
                            placeholder="Sélectionner une équipe"
                            options={teamOptions || []}
                        />
                    </View>
                );

            case 3:
                return (
                    <View style={cardStyle}>
                        <FormSelect
                            name="fc_id"
                            control={control}
                            label="Centre Amazon"
                            placeholder="Sélectionner un centre"
                            options={centersOptions || []}
                        />
                        <FormSelect
                            name="contract"
                            control={control}
                            label="Contrat"
                            placeholder="Sélectionner un contrat"
                            options={contractOptions || []}
                        />
                    </View>
                );

            default:
                return null;
        }
    };

    const getTitle = () => {
        if (step === 1) return "Qui êtes-vous ?";
        if (step === 2) return "Votre rôle";
        return "Votre centre";
    };

    return (
        <ScreenWrapper title="Création du profil">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* HEADER */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 14, color: "#6b7280" }}>
                        Étape {step} sur 3
                    </Text>
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: "700",
                            marginTop: 4,
                        }}
                    >
                        {getTitle()}
                    </Text>
                </View>

                {/* CONTENT */}
                <View key={`step-${step}`}>{renderStep()}</View>

                {/* ACTIONS */}
                <View style={{ marginBottom: 24 }}>
                    {step > 1 && (
                        <Button
                            label="Précédent"
                            variant="secondary"
                            onPress={handlePrev}
                        />
                    )}
                    <Button
                        label={step === 3 ? "Terminer" : "Continuer"}
                        onPress={handleNext}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}
