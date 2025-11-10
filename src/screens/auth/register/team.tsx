import { yupResolver } from "@hookform/resolvers/yup";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";
import { supabase } from "../../../../utils/supabase";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/authContext";
import { containerStyles } from "../../../styles/container.styles";
import { formAuthStyles } from "../../../styles/form.styles";
import { Team } from "../../../types/enum/team.enum";
import { User } from "../../../types/user.interface";

const TeamRegistrationScreen = () => {
    const navigation = useNavigation<any>();

    const insets = useSafeAreaInsets();
    const { session, refreshSession } = useAuth();
    const schema = yup.object({
        team: yup
            .mixed<Team>()
            .oneOf(
                Object.values(Team),
                "Veuillez sélectionner une équipe valide"
            )
            .required("L'équipe est requis"),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: User) => {
        const { data: user, error } = await supabase
            .from("users")
            .update({ team: data.team })
            .eq("id", session?.user.id);

        if (error) {
            console.log("Erreur mise à jour user:", error.message);
            return;
        }

        console.log("Utilisateur mis à jour team:", user);

        await supabase.auth.updateUser({ data: { profile_completed: true } });

        refreshSession();
    };

    console.log("session", session);

    return (
        <SafeScreen backBtn>
            <Text style={formAuthStyles.title}>
                Vous êtes de quelle équipe ?
            </Text>
            <Controller
                control={control}
                name="team"
                render={({ field: { onChange, value } }) => (
                    <View style={formAuthStyles.input}>
                        <Picker
                            selectedValue={value}
                            onValueChange={(val) => onChange(val)}
                        >
                            <Picker.Item
                                label="Sélectionnez une équipe..."
                                value=""
                            />
                            {Object.values(Team).map((team) => (
                                <Picker.Item
                                    key={team}
                                    label={team}
                                    value={team}
                                />
                            ))}
                        </Picker>
                    </View>
                )}
            />
            {errors.team && (
                <Text style={formAuthStyles.error}>{errors.team.message}</Text>
            )}

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                style={containerStyles.bottomButton}
            >
                <View style={formAuthStyles.buttonPrimary}>
                    <Text style={formAuthStyles.buttonText}>
                        Inscription terminer
                    </Text>
                </View>
            </TouchableOpacity>
        </SafeScreen>
    );
};

export default TeamRegistrationScreen;
