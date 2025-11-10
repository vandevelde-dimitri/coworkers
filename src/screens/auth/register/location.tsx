import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as yup from "yup";
import { supabase } from "../../../../utils/supabase";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/authContext";
import { containerStyles } from "../../../styles/container.styles";
import { formAuthStyles } from "../../../styles/form.styles";
import { User } from "../../../types/user.interface";

const LocationEditScreen = () => {
    const navigation = useNavigation<any>();

    const insets = useSafeAreaInsets();
    const { session } = useAuth();
    const schema = yup.object({
        city: yup.string().required("Ville requis"),
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
            .update({ city: data.city })
            .eq("id", session?.user.id);
        if (error) {
            console.log("Erreur mise à jour user:", error.message);
            return;
        }
        console.log("Utilisateur mis à jour:", user);

        navigation.navigate("FloorRegistrationScreen");
    };
    // console.log("session", session);

    return (
        <SafeScreen backBtn>
            <Text style={formAuthStyles.title}>
                Vous êtes de quelle ville ?
            </Text>
            <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="Paris, Lyon, Marseille..."
                        placeholderTextColor="#6b7280"
                        style={formAuthStyles.input}
                    />
                )}
            />
            {errors.city && (
                <Text style={formAuthStyles.error}>{errors.city.message}</Text>
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

export default LocationEditScreen;
