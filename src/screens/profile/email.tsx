import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as yup from "yup";
import { supabase } from "../../../utils/supabase";
import SafeScreen from "../../components/SafeScreen";
import { containerStyles } from "../../styles/container.styles";
import { formAuthStyles } from "../../styles/form.styles";

const EmailRegistrationScreen = () => {
    const navigation = useNavigation<any>();

    const schema = yup.object({
        email: yup.string().email("Email invalide").required("Email requis"),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ email: string }>({
        resolver: yupResolver(schema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (dataSubmit: { email: string }) => {
        const { data, error } = await supabase.auth.updateUser({
            email: dataSubmit.email, // email venant du formulaire
        });

        if (error) {
            console.error("Erreur update email:", error);
            Alert.alert("Erreur", "Impossible de modifier l'email");
            return;
        }

        console.log("Email mis à jour:", data);

        Alert.alert("Succès", "Votre e-mail a été modifié !");
    };

    return (
        <SafeScreen backBtn>
            <ScrollView style={[containerStyles.container]}>
                <Text style={formAuthStyles.title}>
                    Entre ta nouvelle adresse mail
                </Text>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            keyboardType="email-address"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            placeholder="john@doe.fr"
                            placeholderTextColor="#6b7280"
                            style={formAuthStyles.input}
                        />
                    )}
                />
                {errors.email && (
                    <Text style={formAuthStyles.error}>
                        {errors.email.message}
                    </Text>
                )}

                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    style={containerStyles.bottomButton}
                >
                    <View style={formAuthStyles.buttonPrimary}>
                        <Text style={formAuthStyles.buttonText}>
                            Enregistrer
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeScreen>
    );
};

export default EmailRegistrationScreen;
