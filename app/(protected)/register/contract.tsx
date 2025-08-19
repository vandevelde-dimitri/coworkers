import { useAuth } from "@/hooks/authContext";
import { containerStyles } from "@/styles/container.styles";
import { formAuthStyles } from "@/styles/form.styles";
import { Contract } from "@/types/enum/contract.enum";
import { User } from "@/types/user.interface";
import { supabase } from "@/utils/supabase";
import FeatherIcon from "@expo/vector-icons/Feather";
import { yupResolver } from "@hookform/resolvers/yup";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as yup from "yup";

const ContractRegistrationScreen = () => {
    const insets = useSafeAreaInsets();
    const { session } = useAuth();
    const schema = yup.object({
        contract: yup
            .mixed<Contract>()
            .oneOf(
                Object.values(Contract),
                "Veuillez sélectionner un type de contrat valide"
            )
            .required("Le type de contrat est requis"),
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
            .update({
                contract: data.contract,
            })
            .eq("id", session?.user.id);

        if (error) {
            console.log("Erreur mise à jour user:", error.message);
            return;
        }
        console.log("Utilisateur mis à jour:", user);

        router.replace("/(protected)/register/team");
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
                Vous êtes Blue badge ou Green badge ?
            </Text>
            <Controller
                control={control}
                name="contract"
                render={({ field: { onChange, value } }) => (
                    <View style={formAuthStyles.select}>
                        <Picker
                            selectedValue={value}
                            onValueChange={(val) => onChange(val)}
                        >
                            <Picker.Item
                                label="Sélectionnez un contrat..."
                                value=""
                            />
                            {Object.values(Contract).map((contract) => (
                                <Picker.Item
                                    key={contract}
                                    label={contract}
                                    value={contract}
                                />
                            ))}
                        </Picker>
                    </View>
                )}
            />
            {errors.contract && (
                <Text style={formAuthStyles.error}>
                    {errors.contract.message}
                </Text>
            )}

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                style={containerStyles.bottomButton}
            >
                <View style={formAuthStyles.btn}>
                    <Text style={formAuthStyles.btnText}>Suivant</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ContractRegistrationScreen;
