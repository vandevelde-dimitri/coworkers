import { useAuth } from "@/hooks/authContext";
import { containerStyles } from "@/styles/container.styles";
import { formAuthStyles } from "@/styles/form.styles";
import { supabase } from "@/utils/supabase";
import { User } from "@/utils/user.interface";
import FeatherIcon from "@expo/vector-icons/Feather";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as yup from "yup";

const SignupScreen = () => {
    const insets = useSafeAreaInsets();
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

    const onSubmit = async (data: User) => {
        const { data: user, error } = await supabase.from("users").upsert({
            firstname: data.firstname,
            lastname: data.lastname,
        });
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
                <View style={formAuthStyles.btn}>
                    <Text style={formAuthStyles.btnText}>Suivant</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SignupScreen;
