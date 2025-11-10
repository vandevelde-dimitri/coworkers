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
import { Contract } from "../../../types/enum/contract.enum";
import { User } from "../../../types/user.interface";

const ContractRegistrationScreen = () => {
    const navigation = useNavigation<any>();

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

        navigation.navigate("TeamRegistrationScreen");
    };
    console.log("session", session);

    return (
        <SafeScreen backBtn>
            <Text style={formAuthStyles.title}>
                Vous êtes Blue badge ou Green badge ?
            </Text>
            <Controller
                control={control}
                name="contract"
                render={({ field: { onChange, value } }) => (
                    <View style={formAuthStyles.input}>
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
                <View style={formAuthStyles.buttonPrimary}>
                    <Text style={formAuthStyles.buttonText}>Suivant</Text>
                </View>
            </TouchableOpacity>
        </SafeScreen>
    );
};

export default ContractRegistrationScreen;
