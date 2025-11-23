import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { supabase } from "../../../../utils/supabase";
import SafeScreen from "../../../components/SafeScreen";
import { useAuth } from "../../../contexts/authContext";
import { containerStyles } from "../../../styles/container.styles";
import { formAuthStyles } from "../../../styles/form.styles";

const UsernameEditScreen = () => {
    const navigation = useNavigation<any>();

    const { session } = useAuth();
    const schema = yup.object({
        lastname: yup.string().required("Nom requis"),
        firstname: yup.string().required("Prénom requis"),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: { firstname: string; lastname: string }) => {
        console.log("session", session);

        const { data: user, error } = await supabase
            .from("users")
            .update({ firstname: data.firstname, lastname: data.lastname })
            .eq("id", session?.user.id);
        if (error) {
            console.log("Erreur mise à jour user:", error.message);
            return;
        }
        console.log("Utilisateur mis à jour:", user);
        navigation.navigate("LocationEditScreen");
    };

    return (
        <SafeScreen backBtn>
            <Text style={formAuthStyles.title}>
                Vous vous appelez comment ?
            </Text>

            <Controller
                control={control}
                name="firstname"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        keyboardType="default"
                        onChangeText={onChange}
                        placeholder="John"
                        placeholderTextColor="#6b7280"
                        style={formAuthStyles.input}
                        value={value}
                        onBlur={onBlur}
                    />
                )}
            />
            {errors.firstname && (
                <Text style={formAuthStyles.error}>
                    {errors.firstname.message}
                </Text>
            )}
            <Controller
                control={control}
                name="lastname"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="Doe"
                        placeholderTextColor="#6b7280"
                        style={formAuthStyles.input}
                    />
                )}
            />
            {errors.lastname && (
                <Text style={formAuthStyles.error}>
                    {errors.lastname.message}
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

export default UsernameEditScreen;
