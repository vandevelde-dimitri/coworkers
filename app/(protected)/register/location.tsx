import { useAuth } from "@/hooks/authContext";
import { containerStyles } from "@/styles/container.styles";
import { formAuthStyles } from "@/styles/form.styles";
import { User } from "@/types/user.interface";
import { supabase } from "@/utils/supabase";
import FeatherIcon from "@expo/vector-icons/Feather";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as yup from "yup";

const LocationRegistrationScreen = () => {
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

        router.replace("/(protected)/register/contract");
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
                Vous vous appelez comment ?
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
                        placeholder="Doe"
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
                <View style={formAuthStyles.btn}>
                    <Text style={formAuthStyles.btnText}>Suivant</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LocationRegistrationScreen;
