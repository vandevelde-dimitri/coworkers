import { containerStyles } from "@/styles/container.styles";
import { formAuthStyles } from "@/styles/form.styles";
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

const SignupScreen = () => {
    const insets = useSafeAreaInsets();

    const schema = yup.object({
        email: yup.string().email("Email invalide").required("Email requis"),
        password: yup.string().required("Mot de passe requis"),
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: { email: string; password: string }) => {
        const { email, password } = data;
        const { data: user, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.log("Erreur inscription:", error.message);
            return;
        }
        router.replace("/(tabs)/explore");
    };

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

            <Text style={formAuthStyles.title}>Inscrivez-vous</Text>
            <Text style={formAuthStyles.subtitle}>
                Vous allez recevoir un e-mail de confirmation.
            </Text>
            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        keyboardType="email-address"
                        onChangeText={onChange}
                        placeholder="john@example.com"
                        placeholderTextColor="#6b7280"
                        style={formAuthStyles.input}
                        value={value}
                        onBlur={onBlur}
                    />
                )}
            />
            {errors.email && (
                <Text style={formAuthStyles.error}>{errors.email.message}</Text>
            )}
            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="********"
                        placeholderTextColor="#6b7280"
                        style={formAuthStyles.input}
                        secureTextEntry={true}
                    />
                )}
            />
            {errors.password && (
                <Text style={formAuthStyles.error}>
                    {errors.password.message}
                </Text>
            )}
            <Text style={formAuthStyles.title}>Déja un compte ?</Text>
            <Text
                style={formAuthStyles.link}
                onPress={() => router.push("/(public)/signin")}
            >
                Connectez-vous
            </Text>
            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                style={containerStyles.bottomButton}
            >
                <View style={formAuthStyles.btn}>
                    <Text style={formAuthStyles.btnText}>Recevoir</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SignupScreen;
