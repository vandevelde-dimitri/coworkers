import { yupResolver } from "@hookform/resolvers/yup";

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { supabase } from "../../../utils/supabase";
import { useAuth } from "../../contexts/authContext";
import { useFloorsAll } from "../../hooks/useFloor";
import { useCurrentUser } from "../../hooks/user/useUsers";
import { accountStyles } from "../../styles/account.styles";
import { Contract } from "../../types/enum/contract.enum";
import { Team } from "../../types/enum/team.enum";

const EditProfileScreen = () => {
    const { data: user } = useCurrentUser();
    const navigation = useNavigation();

    const { session, refreshSession } = useAuth();
    const { data: floors, isLoading, error } = useFloorsAll();

    // Form values type distinct de l'interface User pour éviter les incompatibilités
    type FormValues = {
        firstname: string;
        lastname: string;
        city: string;
        floor: string;
        contract: Contract | "" | undefined;
        team: Team | "" | undefined;
    };

    const schema = yup.object({
        firstname: yup.string().required("Prénom requis"),
        lastname: yup.string().required("Nom requis"),
        city: yup.string().required("Ville requis"),
        floor: yup.string().required("Centre requis"),
        contract: yup
            .mixed<Contract>()
            .oneOf(
                Object.values(Contract),
                "Veuillez sélectionner un type de contrat valide"
            )
            .required("Le type de contrat est requis"),
        team: yup
            .mixed<Team>()
            .oneOf(
                Object.values(Team),
                "Veuillez sélectionner une équipe valide"
            )
            .required("L'équipe est requis"),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstname: "",
            lastname: "",
            city: "",
            floor: "",
            contract: "",
            team: "",
        },
    });

    const onSubmit = async (data: any) => {
        const values: FormValues = data as FormValues;
        try {
            const { data: user, error: updateError } = await supabase
                .from("users")
                .update({
                    firstname: values.firstname,
                    lastname: values.lastname,
                    city: values.city,
                    fc_id: values.floor,
                    contract: values.contract,
                    team: values.team,
                })
                .eq("id", session?.user.id);

            if (updateError) {
                console.log("Erreur mise à jour user:", updateError.message);
                return;
            }

            // Marquer le profil comme complété et rafraîchir la session
            await supabase.auth.updateUser({
                data: { profile_completed: true },
            });
            await refreshSession();
            console.log("Utilisateur mis à jour:", user);
            // Note: on ne force pas la navigation ici ; refreshSession va mettre à jour l'état
        } catch (err) {
            console.log("Erreur lors de la soumission :", err);
        }
    };

    if (isLoading) {
        return <Text>Chargement...</Text>;
    }
    if (error) {
        return <Text>Erreur de chargement des centres.</Text>;
    }

    return (
        <View style={accountStyles.container}>
            <ScrollView
                contentContainerStyle={accountStyles.content}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={accountStyles.section}>
                    <Text style={accountStyles.sectionTitle}>Informations</Text>
                    <View style={accountStyles.sectionBody}>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate("UsernameRegisterScreen");
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>
                                Nom / Prénom
                            </Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.firstname} {user?.lastname}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate("FloorRegistrationScreen");
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>
                                Centre Amazon
                            </Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.fc.name}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate("TeamRegistrationScreen");
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>Équipe</Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.team}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate(
                                    "ContractRegistrationScreen"
                                );
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>Contrat</Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.contract}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={accountStyles.row}
                            onPress={() => {
                                navigation.navigate(
                                    "LocationRegistrationScreen"
                                );
                            }}
                        >
                            <Text style={accountStyles.rowLabel}>Ville</Text>
                            <Text style={accountStyles.rowValue}>
                                {user?.city}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default EditProfileScreen;
