import { useAuth } from "@/hooks/authContext";
import { useFloorsAll } from "@/hooks/useFloor";
import { containerStyles } from "@/styles/container.styles";
import { formAuthStyles } from "@/styles/form.styles";
import { User } from "@/types/user.interface";
import { supabase } from "@/utils/supabase";
import FeatherIcon from "@expo/vector-icons/Feather";
import { yupResolver } from "@hookform/resolvers/yup";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as yup from "yup";

const FloorRegistrationScreen = () => {
    const insets = useSafeAreaInsets();
    const { data: floors, isLoading, error } = useFloorsAll();

    const { session } = useAuth();
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

        console.log("Floor data submitted:", data);
        router.replace("/(protected)/register/team");
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
                Vous faites parti de quelle centre Amazon ?
            </Text>
            <Controller
                control={control}
                name="floor"
                render={({ field: { onChange, value } }) => (
                    <View style={formAuthStyles.select}>
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
                <Text style={formAuthStyles.error}>{errors.floor.message}</Text>
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

export default FloorRegistrationScreen;
