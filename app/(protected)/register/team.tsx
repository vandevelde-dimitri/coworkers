import { useAuth } from "@/hooks/authContext";
import { containerStyles } from "@/styles/container.styles";
import { formAuthStyles } from "@/styles/form.styles";
import { Team } from "@/types/enum/team.enum";
import { User } from "@/types/user.interface";
import { supabase } from "@/utils/supabase";
import FeatherIcon from "@expo/vector-icons/Feather";
import { yupResolver } from "@hookform/resolvers/yup";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as yup from "yup";

const TeamRegistrationScreen = () => {
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
        <SafeAreaView
            style={[
                formAuthStyles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    // paddingLeft: insets.left,
                    // paddingRight: insets.right,
                },
            ]}
        >
            <View style={containerStyles.header}>
                <View style={containerStyles.headerBack}>
                    <FeatherIcon
                        color="#1D2A32"
                        name="chevron-left"
                        size={30}
                    />
                </View>
            </View>

            <Text style={formAuthStyles.title}>
                Vous êtes de quelle équipe ?
            </Text>
            <Controller
                control={control}
                name="team"
                render={({ field: { onChange, value } }) => (
                    <View style={formAuthStyles.select}>
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
                <View style={formAuthStyles.btn}>
                    <Text style={formAuthStyles.btnText}>
                        Inscription terminer
                    </Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default TeamRegistrationScreen;
