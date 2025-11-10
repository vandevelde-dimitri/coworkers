import { yupResolver } from "@hookform/resolvers/yup";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { supabase } from "../../../utils/supabase";
import SafeScreen from "../../components/SafeScreen";
import { useAuth } from "../../contexts/authContext";
import { useFloorsAll } from "../../hooks/useFloor";
import { containerStyles } from "../../styles/container.styles";
import { formAuthStyles } from "../../styles/form.styles";
import { User } from "../../types/user.interface";

const FloorRegistrationScreen = () => {
    const navigation = useNavigation();

    const { data: floors, isLoading, error } = useFloorsAll();

    const { session, refreshSession } = useAuth();
    const schema = yup.object({
        floor: yup.string().required("Centre requis"),
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
                fc_id: data.floor,
            })
            .eq("id", session?.user.id);

        if (error) {
            console.log("Erreur mise à jour user:", error.message);
            return;
        }
        console.log("Utilisateur mis à jour:", user);

        navigation.navigate("ProfileHome");
        refreshSession();
    };
    // console.log("session", session);
    if (isLoading) {
        return <Text>Chargement...</Text>;
    }
    if (error) {
        return <Text>Erreur de chargement des annonces.</Text>;
    }

    if (!floors || floors.length === 0) {
        return <Text>Aucune annonce trouvée.</Text>;
    }
    return (
        <SafeScreen backBtn>
            <ScrollView>
                <Text style={formAuthStyles.title}>
                    Vous faites parti de quelle centre Amazon ?
                </Text>
                <Controller
                    control={control}
                    name="floor"
                    render={({ field: { onChange, value } }) => (
                        <View style={formAuthStyles.input}>
                            <Picker
                                selectedValue={value}
                                onValueChange={(val) => onChange(val)}
                            >
                                <Picker.Item
                                    label="Sélectionnez un centre..."
                                    value=""
                                />
                                {floors.map((floor) => (
                                    <Picker.Item
                                        key={floor.id}
                                        label={floor.name}
                                        value={floor.id}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}
                />
                {errors.floor && (
                    <Text style={formAuthStyles.error}>
                        {errors.floor.message}
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

export default FloorRegistrationScreen;
